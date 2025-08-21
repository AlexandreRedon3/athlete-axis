#!/bin/bash
# Script de configuration automatique du monitoring AthleteAxis

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis validés"
}

# Création de la structure de dossiers
create_directories() {
    log_info "Création de la structure de dossiers..."
    
    # Dossiers Grafana
    mkdir -p docker/monitoring/grafana/provisioning/dashboards/
    mkdir -p docker/monitoring/grafana/provisioning/datasources/
    mkdir -p docker/monitoring/grafana/provisioning/alerting/
    mkdir -p docker/monitoring/grafana/dashboards/
    
    # Dossiers Prometheus
    mkdir -p docker/monitoring/prometheus/
    
    # Dossiers Loki
    mkdir -p docker/monitoring/loki/
    
    # Dossiers Promtail
    mkdir -p docker/monitoring/promtail/
    
    # Dossiers de backup
    mkdir -p backups/grafana/
    mkdir -p exports/dashboards/
    
    log_success "Structure de dossiers créée"
}

# Copie des fichiers de configuration
copy_config_files() {
    log_info "Copie des fichiers de configuration..."
    
    # Fichier datasources Grafana
    cat > docker/monitoring/grafana/provisioning/datasources/datasources.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
    jsonData:
      httpMethod: POST
      manageAlerts: true
      prometheusType: Prometheus
      prometheusVersion: 2.44.0
      cacheLevel: 'High'
      disableRecordingRules: false
      incrementalQueryOverlapWindow: 10m

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    editable: true
    jsonData:
      maxLines: 1000
EOF

    # Configuration des dashboards
    cat > docker/monitoring/grafana/provisioning/dashboards/dashboard.yml << 'EOF'
apiVersion: 1

providers:
  - name: 'default'
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    allowUiUpdates: true
    options:
      path: /var/lib/grafana/dashboards
EOF

    # Règles d'alertes Prometheus
    cat > docker/monitoring/prometheus/alert_rules.yml << 'EOF'
groups:
  - name: athleteaxis
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "CPU usage élevé"
          description: "CPU usage is above 80% for more than 2 minutes"
      
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Utilisation mémoire critique"
          description: "Memory usage is above 85% for more than 5 minutes"
EOF

    log_success "Fichiers de configuration copiés"
}

# Vérification que l'application est démarrée
check_app_running() {
    log_info "Vérification que l'application AthleteAxis est démarrée..."
    
    if curl -s -f http://localhost:3000/api/metrics > /dev/null; then
        log_success "Application accessible sur le port 3000"
    else
        log_warning "Application non accessible sur le port 3000"
        log_info "Démarrez l'application avec: npm run dev"
        read -p "Continuer quand même ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Démarrage des services de monitoring
start_monitoring() {
    log_info "Démarrage de la stack de monitoring..."
    
    if docker compose -f docker/monitoring/docker-compose.monitoring.yml up -d; then
        log_success "Services de monitoring démarrés"
        
        # Attendre que les services soient prêts
        log_info "Attente du démarrage des services..."
        sleep 15
        
        # Vérification des services
        check_services_health
    else
        log_error "Erreur lors du démarrage des services"
        exit 1
    fi
}

# Vérification de la santé des services
check_services_health() {
    log_info "Vérification de la santé des services..."
    
    # Prometheus
    if curl -s -f http://localhost:9090/-/healthy > /dev/null; then
        log_success "Prometheus: OK (http://localhost:9090)"
    else
        log_warning "Prometheus: Non accessible"
    fi
    
    # Grafana
    if curl -s -f http://localhost:3001/api/health > /dev/null; then
        log_success "Grafana: OK (http://localhost:3001)"
    else
        log_warning "Grafana: Non accessible"
    fi
    
    # Node Exporter
    if curl -s -f http://localhost:9100/metrics > /dev/null; then
        log_success "Node Exporter: OK (http://localhost:9100)"
    else
        log_warning "Node Exporter: Non accessible"
    fi
    
    # Loki
    if curl -s -f http://localhost:3100/ready > /dev/null; then
        log_success "Loki: OK (http://localhost:3100)"
    else
        log_warning "Loki: Non accessible"
    fi
}

# Import des dashboards
import_dashboards() {
    log_info "Configuration des dashboards Grafana..."
    
    # Attendre que Grafana soit complètement démarré
    log_info "Attente de la disponibilité de Grafana..."
    local retry_count=0
    local max_retries=30
    
    while ! curl -s -f http://localhost:3001/api/health > /dev/null; do
        if [ $retry_count -ge $max_retries ]; then
            log_error "Grafana n'est pas accessible après $max_retries tentatives"
            return 1
        fi
        sleep 2
        ((retry_count++))
    done
    
    log_success "Dashboards configurés (ils seront disponibles après le premier login)"
}

# Affichage des informations finales
show_final_info() {
    echo
    log_success "🎉 Configuration du monitoring terminée avec succès!"
    echo
    echo "📊 Services disponibles:"
    echo "  🎨 Grafana:        http://localhost:3001"
    echo "      👤 Utilisateur: admin"
    echo "      🔑 Mot de passe: admin123"
    echo
    echo "  📈 Prometheus:     http://localhost:9090"
    echo "  📊 Node Exporter:  http://localhost:9100"
    echo "  📝 Loki:          http://localhost:3100"
    echo
    echo "📋 Dashboards Grafana:"
    echo "  • Business:       http://localhost:3001/d/athleteaxis-main"
    echo "  • Système:        http://localhost:3001/d/athleteaxis-system"
    echo
    echo "🛠️  Commandes utiles:"
    echo "  make monitoring-status    # Vérifier le statut"
    echo "  make monitoring-logs      # Voir les logs"
    echo "  make monitoring-restart   # Redémarrer"
    echo "  make monitoring-down      # Arrêter"
    echo
    log_info "💡 Conseil: Attendez quelques minutes pour que toutes les métriques se collectent"
}

# Fonction principale
main() {
    echo "🏋️  AthleteAxis - Configuration du Monitoring"
    echo "=============================================="
    echo
    
    check_prerequisites
    create_directories
    copy_config_files
    check_app_running
    start_monitoring
    import_dashboards
    show_final_info
}

# Gestion des signaux
trap 'log_error "Installation interrompue"; exit 1' INT TERM

# Exécution du script principal
main "$@"