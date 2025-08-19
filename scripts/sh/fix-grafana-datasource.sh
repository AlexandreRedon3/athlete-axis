#!/bin/bash
# scripts/fix-grafana-datasource.sh

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

echo "🔧 Correction des datasources Grafana"
echo "======================================"

# 1. Vérifier que les services tournent
log_info "Vérification des services..."
if ! docker ps | grep -q "athlete-axis-grafana"; then
    log_error "Grafana n'est pas démarré"
    log_info "Démarrez avec: make monitoring-up"
    exit 1
fi

if ! docker ps | grep -q "athlete-axis-prometheus"; then
    log_error "Prometheus n'est pas démarré"
    log_info "Démarrez avec: make monitoring-up"
    exit 1
fi

log_success "Services Grafana et Prometheus démarrés"

# 2. Vérifier les logs Grafana pour identifier le problème
log_info "Vérification des logs Grafana..."
if docker logs athlete-axis-grafana 2>&1 | grep -q "datasource"; then
    log_warning "Logs datasource trouvés - diagnostic en cours..."
    docker logs athlete-axis-grafana 2>&1 | grep "datasource" | tail -5
fi

# 3. Tester la connectivité Prometheus depuis Grafana
log_info "Test de connectivité Prometheus depuis Grafana..."
if docker exec athlete-axis-grafana wget -qO- http://prometheus:9090/api/v1/status/config >/dev/null 2>&1; then
    log_success "Prometheus accessible depuis Grafana"
else
    log_error "Prometheus non accessible depuis Grafana"
    log_info "Vérification du réseau Docker..."
    docker network ls | grep monitoring
fi

# 4. Corriger le fichier datasources.yml
log_info "Correction du fichier datasources.yml..."
mkdir -p docker/monitoring/grafana/provisioning/datasources/

cat > docker/monitoring/grafana/provisioning/datasources/datasources.yml << 'EOF'
apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    uid: prometheus
    isDefault: true
    editable: true
    version: 1
    jsonData:
      httpMethod: POST
      manageAlerts: true
      prometheusType: Prometheus
      prometheusVersion: 2.44.0
      cacheLevel: 'High'
      disableRecordingRules: false
      incrementalQueryOverlapWindow: 10m
    secureJsonFields: {}

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    uid: loki
    editable: true
    version: 1
    jsonData:
      maxLines: 1000
    secureJsonFields: {}
EOF

log_success "Fichier datasources.yml mis à jour"

# 5. Redémarrer Grafana pour recharger la config
log_info "Redémarrage de Grafana..."
docker restart athlete-axis-grafana

log_info "Attente du redémarrage de Grafana..."
sleep 10

# 6. Vérifier que Grafana est de nouveau accessible
log_info "Vérification de l'accessibilité de Grafana..."
RETRY_COUNT=0
MAX_RETRIES=30
while ! curl -s -f http://localhost:3001/api/health >/dev/null; do
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        log_error "Grafana non accessible après $MAX_RETRIES tentatives"
        exit 1
    fi
    sleep 2
    ((RETRY_COUNT++))
done

log_success "Grafana redémarré et accessible"

# 7. Instructions finales
echo
log_success "🎉 Correction terminée!"
echo "📋 Étapes suivantes:"
echo "1. Aller sur: http://localhost:3001"
echo "2. Login: admin / admin123"
echo "3. Aller dans: Configuration > Data sources"
echo "4. Vérifier que 'Prometheus' apparaît et fonctionne"
echo "5. Cliquer sur 'Test' pour valider la connexion"
echo
echo "📊 Si le problème persiste:"
echo "• Vérifiez les dashboards: http://localhost:3001/d/athleteaxis-main"
echo "• Consultez les logs: docker logs athlete-axis-grafana"
echo
log_info "💡 Si les dashboards sont toujours vides, attendez 2-3 minutes pour la collecte des métriques"