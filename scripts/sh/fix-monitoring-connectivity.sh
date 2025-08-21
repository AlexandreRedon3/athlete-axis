#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo "🔧 Correction des problèmes de connectivité monitoring"
echo "===================================================="

# 1. Arrêter les services
log_info "Arrêt des services monitoring..."
make monitoring-down

# 2. Trouver l'IP de l'interface Docker
log_info "Détection de l'IP Docker..."
DOCKER_IP=$(ip route | grep docker0 | grep src | awk '{print $9}' | head -1)
if [ -z "$DOCKER_IP" ]; then
    DOCKER_IP="172.17.0.1"
    log_warning "IP Docker par défaut utilisée: $DOCKER_IP"
else
    log_success "IP Docker détectée: $DOCKER_IP"
fi

# 3. Vérifier que l'app Next.js est accessible
log_info "Vérification de l'accessibilité de l'app Next.js..."
if curl -s -f http://localhost:3000/api/metrics > /dev/null; then
    log_success "App Next.js accessible sur localhost:3000"
    
    # Test depuis l'IP Docker
    if curl -s -f http://$DOCKER_IP:3000/api/metrics > /dev/null; then
        log_success "App accessible depuis l'IP Docker: $DOCKER_IP:3000"
        USE_DOCKER_IP=true
    else
        log_warning "App non accessible depuis l'IP Docker, utilisation du mode host"
        USE_DOCKER_IP=false
    fi
else
    log_error "App Next.js non accessible sur localhost:3000"
    log_error "Veuillez démarrer votre app avec: npm run dev"
    exit 1
fi

# 4. Mettre à jour prometheus.yml
log_info "Mise à jour de la configuration Prometheus..."
cat > docker/monitoring/prometheus/prometheus.yml << EOF
---
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node_exporter:9100']

  - job_name: 'nextjs-app'
    static_configs:
$(if [ "$USE_DOCKER_IP" = true ]; then
    echo "      - targets: ['$DOCKER_IP:3000']"
else
    echo "      - targets: ['localhost:3000']"
fi)
    metrics_path: '/api/metrics'
    scrape_interval: 30s
    scrape_timeout: 10s

  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']
    scrape_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
EOF

# 5. Modifier docker-compose si nécessaire (mode host)
if [ "$USE_DOCKER_IP" = false ]; then
    log_info "Configuration Prometheus en mode host network..."
    # Ici on pourrait modifier le docker-compose mais c'est plus complexe
    # On garde la solution IP pour l'instant
fi

# 6. Redémarrer les services
log_info "Redémarrage des services monitoring..."
make monitoring-up

# 7. Attendre et vérifier
log_info "Attente du démarrage des services..."
sleep 15

log_info "Vérification du statut..."
make monitoring-status

# 8. Test final
log_info "Test de connectivité final..."
sleep 5

if curl -s http://localhost:9090/api/v1/targets | grep -q "nextjs-app"; then
    log_success "Configuration appliquée avec succès!"
    log_info "Vérifiez les targets sur: http://localhost:9090/targets"
    log_info "Dashboards Grafana: http://localhost:3001"
else
    log_warning "Vérifiez manuellement les targets sur: http://localhost:9090/targets"
fi

echo
log_success "🎉 Correction terminée!"
echo "📊 Accès aux services:"
echo "   • Prometheus: http://localhost:9090/targets"
echo "   • Grafana: http://localhost:3001 (admin/admin123)"
echo "   • Métriques App: http://localhost:3000/api/metrics"