// src/components/coach/dashboard/modern-coach-dashboard-optimized.tsx
"use client"

import { useState } from 'react';
import { Users, Activity, Calendar, Clock, Loader2, AlertCircle } from 'lucide-react';

// Hooks
import { useCoachStats } from '@/hooks/use-coach-stats';
import { useCoachPrograms } from '@/hooks/use-coach-programs';
import { useCoachClients } from '@/hooks/use-coach-client';

// Composants (sans DashboardHeader)
import { DashboardNav } from './navigation/dashboard-nav';
import { StatsCard } from './stats/stats-card';
import { ClientsTable } from './clients/clients-table';
import { DailySessions } from './sessions/daily-session';
import { PerformancePanel } from './performance/performance-panel';
import { PerformanceChart } from './charts/performance-chart';
import { StatsChart } from './charts/stats-chart';
import { useTheme } from '../../../lib/theme-provider';
import { Client } from './clients/clients-table';
import { Session } from './sessions/daily-session';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-emerald-500" />
      <p className="text-sm text-muted-foreground">Chargement des données...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  const { colors } = useTheme();
  
  return (
    <div className={`${colors.cardBg} rounded-xl p-6 border border-red-200 text-center`}>
      <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-red-900 mb-2">Erreur de chargement</h3>
      <p className="text-red-700 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
};

export const ModernCoachDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { colors } = useTheme();

  // Hooks API
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useCoachStats();
  const { programs, isLoading: programsLoading, error: programsError, refetch: refetchPrograms } = useCoachPrograms();
  const { clients, isLoading: clientsLoading, error: clientsError, refetch: refetchClients } = useCoachClients();

  // 📊 Préparation des données pour les graphiques
  const performanceData = [
    { month: 'Jan', clients: stats?.activeClients || 0, programs: stats?.publishedPrograms || 0, sessions: 24 },
    { month: 'Fév', clients: (stats?.activeClients || 0) + 2, programs: (stats?.publishedPrograms || 0) + 1, sessions: 28 },
    { month: 'Mar', clients: (stats?.activeClients || 0) + 4, programs: (stats?.publishedPrograms || 0) + 2, sessions: 32 },
    { month: 'Avr', clients: stats?.activeClients || 0, programs: stats?.publishedPrograms || 0, sessions: 30 },
  ];

  const statsChartData = [
    { name: 'Clients actifs', value: stats?.activeClients || 0 },
    { name: 'Programmes', value: stats?.publishedPrograms || 0 },
    { name: 'Taux réussite', value: stats?.completionRate || 0 }
  ];

  // 📅 Données simulées pour les sessions (à remplacer par un hook API)
  const todaySessions: Session[] = [
    { 
      id: '1', 
      client: clients[0]?.name || "Sophie Martin", 
      type: "Séance de renforcement", 
      time: "10:00",
      status: 'upcoming'
    },
    { 
      id: '2', 
      client: clients[1]?.name || "Thomas Dubois", 
      type: "Cardio intensif", 
      time: "14:30",
      status: 'upcoming'
    }
  ];

  const performanceMetrics = [
    { label: "Séances complétées", value: `${stats?.completionRate || 0}%`, percentage: stats?.completionRate || 0, color: "bg-blue-500" },
    { label: "Programmes publiés", value: `${stats?.publishRate || 0}%`, percentage: stats?.publishRate || 0, color: "bg-emerald-500" },
    { label: "Clients actifs", value: `${Math.round(((stats?.activeClients || 0) / (stats?.totalClients || 1)) * 100)}%`, percentage: Math.round(((stats?.activeClients || 0) / (stats?.totalClients || 1)) * 100), color: "bg-yellow-500" }
  ];

  // 🎯 Handlers
  const handleViewAllClients = () => {
    setSelectedTab('clients');
  };

  const handleClientDetails = (client: Client) => {
    console.log('Voir détails client:', client);
  };

  const handleViewCalendar = () => {
    setSelectedTab('calendar');
  };

  const handleSessionClick = (session: Session) => {
    console.log('Session cliquée:', session);
  };

  const handleNewClient = () => {
    console.log('Nouveau client');
  };

  const handleScheduleSession = () => {
    console.log('Planifier séance');
  };

  // Transformation des données clients pour le tableau
  const clientsTableData: Client[] = clients.map(client => ({
    id: client.id,
    name: client.name,
    program: client.program?.name || 'Aucun programme',
    progress: client.progress
  }));

  // 📊 Statistiques basées sur les vraies données API
  const statsCards = [
    { 
      title: "Clients actifs", 
      value: stats?.activeClients?.toString() || "0", 
      change: stats?.newClientsThisMonth || 0, 
      icon: Users, 
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600" 
    },
    { 
      title: "Programmes", 
      value: stats?.publishedPrograms?.toString() || "0", 
      change: stats?.newProgramsThisMonth || 0, 
      icon: Activity, 
      gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600" 
    },
    { 
      title: "Total clients", 
      value: stats?.totalClients?.toString() || "0", 
      change: Math.round(((stats?.activeClients || 0) / (stats?.totalClients || 1)) * 100), 
      icon: Calendar, 
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600" 
    },
    { 
      title: "Taux réussite", 
      value: `${stats?.completionRate || 0}%`, 
      icon: Clock, 
      gradient: "bg-gradient-to-br from-orange-500 to-orange-600" 
    }
  ];

  return (
    <div className={`min-h-screen ${colors.bg} transition-colors duration-300`}>
      {/* Navigation uniquement (pas de header) */}
      <DashboardNav
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {/* Main Content avec padding top réduit */}
      <main className="max-w-7xl mx-auto px-6 py-4">
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Stats Grid */}
            {statsLoading ? (
              <LoadingSpinner />
            ) : statsError ? (
              <ErrorMessage message={statsError} onRetry={refetchStats} />
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => (
                  <StatsCard key={index} {...stat} />
                ))}
              </div>
            )}

            {/* Charts Section */}
            {!statsLoading && !statsError && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
                  <h3 className={`${colors.text} text-sm font-bold mb-3`}>Performance sur 4 mois</h3>
                  <PerformanceChart data={performanceData} />
                </div>
                <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
                  <h3 className={`${colors.text} text-sm font-bold mb-3`}>Répartition des activités</h3>
                  <StatsChart data={statsChartData} type="pie" />
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-380px)]">
              {/* Clients Table */}
              {clientsLoading ? (
                <LoadingSpinner />
              ) : clientsError ? (
                <ErrorMessage message={clientsError} onRetry={refetchClients} />
              ) : (
                <ClientsTable
                  clients={clientsTableData.slice(0, 4)}
                  onViewAll={handleViewAllClients}
                  onViewDetails={handleClientDetails}
                />
              )}

              {/* Daily Sessions */}
              <DailySessions
                sessions={todaySessions}
                onViewCalendar={handleViewCalendar}
                onSessionClick={handleSessionClick}
              />

              {/* Performance Panel */}
              <PerformancePanel
                data={performanceMetrics}
                onNewClient={handleNewClient}
                onScheduleSession={handleScheduleSession}
              />
            </div>
          </div>
        )}

        {/* Section Programmes */}
        {selectedTab === 'training' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${colors.text} text-2xl font-bold`}>Mes programmes</h2>
                <p className={`${colors.textSecondary}`}>Gérez et créez vos programmes d'entraînement</p>
              </div>
            </div>

            {programsLoading ? (
              <LoadingSpinner />
            ) : programsError ? (
              <ErrorMessage message={programsError} onRetry={refetchPrograms} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                  <div key={program.id} className={`${colors.cardBg} rounded-xl p-6 shadow-sm ${colors.border} border hover:shadow-lg transition-all duration-300 group`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                          🏃‍♀️
                        </div>
                        <div>
                          <h3 className={`${colors.text} font-bold group-hover:text-blue-600 transition-colors`}>
                            {program.name}
                          </h3>
                          <p className={`${colors.textSecondary} text-sm`}>{program.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        program.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {program.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    
                    <p className={`${colors.textSecondary} text-sm mb-4 line-clamp-2`}>
                      {program.description}
                    </p>
                    
                    <div className={`flex items-center justify-between text-sm ${colors.textSecondary} mb-4`}>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {program.durationWeeks} sem.
                      </span>
                      <span className="flex items-center">
                        <Activity className="w-4 h-4 mr-1" />
                        {program.sessionsPerWeek}/sem
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {program.level}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-sm">
                        Voir
                      </button>
                      <button className="flex-1 p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-sm">
                        Modifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section Clients */}
        {selectedTab === 'clients' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${colors.text} text-2xl font-bold`}>Mes clients</h2>
                <p className={`${colors.textSecondary}`}>Gérez vos clients et leur progression</p>
              </div>
            </div>

            {clientsLoading ? (
              <LoadingSpinner />
            ) : clientsError ? (
              <ErrorMessage message={clientsError} onRetry={refetchClients} />
            ) : (
              <div className={`${colors.cardBg} rounded-xl shadow-sm ${colors.border} border overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${colors.border} border-b`}>
                      <tr>
                        <th className={`${colors.textSecondary} text-left text-sm font-medium py-4 px-6`}>Client</th>
                        <th className={`${colors.textSecondary} text-left text-sm font-medium py-4 px-6`}>Programme</th>
                        <th className={`${colors.textSecondary} text-left text-sm font-medium py-4 px-6`}>Progression</th>
                        <th className={`${colors.textSecondary} text-left text-sm font-medium py-4 px-6`}>Statut</th>
                        <th className={`${colors.textSecondary} text-left text-sm font-medium py-4 px-6`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className={`${colors.hover} transition-colors`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {client.name.charAt(0)}
                              </div>
                              <div>
                                <p className={`${colors.text} font-medium`}>{client.name}</p>
                                <p className={`${colors.textSecondary} text-sm`}>{client.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className={`${colors.text} text-sm`}>
                              {client.program?.name || 'Aucun programme'}
                            </p>
                            {client.program?.level && (
                              <p className={`${colors.textSecondary} text-xs`}>
                                {client.program.level}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                              <span className={`${colors.textSecondary} text-sm`}>
                                {client.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {client.isActive ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleClientDetails({
                                  id: client.id,
                                  name: client.name,
                                  program: client.program?.name || 'Aucun',
                                  progress: client.progress
                                })}
                                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                              >
                                Voir
                              </button>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                                Modifier
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Autres sections (placeholder) */}
        {!['overview', 'training', 'clients'].includes(selectedTab) && (
          <div className={`${colors.cardBg} rounded-xl p-8 shadow-sm ${colors.border} border text-center h-[calc(100vh-280px)] flex items-center justify-center`}>
            <div>
              <Activity className={`w-12 h-12 ${colors.textSecondary} mx-auto mb-4`} />
              <h3 className={`${colors.text} text-lg font-medium mb-2`}>
                Section {selectedTab}
              </h3>
              <p className={`${colors.textSecondary}`}>
                Cette section sera implémentée prochainement
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};