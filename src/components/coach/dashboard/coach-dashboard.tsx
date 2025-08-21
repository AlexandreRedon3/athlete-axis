// src/components/coach/dashboard/modern-coach-dashboard-optimized.tsx
"use client"

import { 
  Activity, 
  AlertCircle,
  Calendar, 
  Clock, 
  Copy,
  Loader2,
  Share,
  Trash2,
  Users, 
  X
} from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';

import { useCoachClients } from '../../../hooks/use-coach-client';
import { useCoachPrograms } from '../../../hooks/use-coach-programs';
import { useCoachStats } from '../../../hooks/use-coach-stats';
import { useDeleteProgram, useDuplicateProgram, usePublishProgram } from '../../../hooks/use-program-actions';
import { useProgramSessions } from '../../../hooks/use-program-sessions';
import { useTodaySessions } from '../../../hooks/use-today-sessions';
import { useTheme } from '../../../lib/theme-provider';
import { ConfirmDialog } from '../../ui/confirm-dialog';
import { EditProgramForm } from '../forms/edit-program-form';
import { ProgramOverview } from '../programs/program-overview';
import { ProgramSessionsManager } from '../programs/program-sessions-manager';
import { PerformanceChart } from './charts/performance-chart';
import { StatsChart } from './charts/stats-chart';
import { Client as ClientTableType,ClientsTable } from './clients/clients-table';
import { DashboardNav } from './navigation/dashboard-nav';
import { PerformancePanel } from './performance/performance-panel';
import { DailySessions, Session as SessionType } from './sessions/daily-session';

// Types pour les données internes
interface ClientData {
  id: string;
  name: string;
  email: string;
  program?: {
    name: string;
    level: string;
  };
  progress: number;
  isActive: boolean;
}

interface SessionData {
  id: string;
  client: string;
  type: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface StatsCardProps {
  title: string;
  value: string;
  change?: number;
  icon: any;
  gradient: string;
}

// Composants manquants
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

const StatsCard = ({ title, value, change, icon: Icon, gradient }: StatsCardProps) => {
  const { colors } = useTheme();
  
  return (
    <div className={`${colors.cardBg} rounded-xl p-4 shadow-sm ${colors.border} border`}>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${gradient} rounded-lg flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className={`${colors.textSecondary} text-sm`}>{title}</p>
          <p className={`${colors.text} text-xl font-bold`}>{value}</p>
          {change !== undefined && (
            <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ModernCoachDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete-program' | 'duplicate-program' | null;
    programId: string | null;
    programName: string | null;
  }>({
    isOpen: false,
    type: null,
    programId: null,
    programName: null
  });
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const { colors } = useTheme();

  // Hooks API
  const { stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useCoachStats();
  const { programs, isLoading: programsLoading, error: programsError, refetch: refetchPrograms } = useCoachPrograms();
  const { clients, isLoading: clientsLoading, error: clientsError, refetch: refetchClients } = useCoachClients();
  const { sessions: todaySessions, isLoading: todaySessionsLoading, error: todaySessionsError, refetch: refetchTodaySessions } = useTodaySessions();
  
  // Rechargement automatique lors du changement d'onglet
  useEffect(() => {
    if (selectedTab === 'overview') {
      refetchStats();
      refetchClients();
      refetchTodaySessions();
    } else if (selectedTab === 'training') {
      refetchPrograms();
    } else if (selectedTab === 'clients') {
      refetchClients();
    }
  }, [selectedTab]); // Suppression des dépendances qui causent la boucle
  
  // Hook pour les sessions du programme sélectionné
  const { 
    sessions: programSessions, 
    clientProgress,
    isLoading: sessionsLoading, 
    error: sessionsError, 
    refetch: refetchSessions 
  } = useProgramSessions(selectedProgram?.id || null);
  
  // Rechargement automatique des sessions quand un programme est sélectionné
  useEffect(() => {
    if (selectedProgram?.id) {
      refetchSessions();
    }
  }, [selectedProgram?.id]); // Suppression de refetchSessions des dépendances
  
  // Hooks pour les actions sur les programmes
  const { deleteProgram, isDeleting } = useDeleteProgram();
  const { duplicateProgram, isDuplicating } = useDuplicateProgram();
  const { publishProgram, unpublishProgram, isPublishing, isUnpublishing } = usePublishProgram();

  // 📊 Préparation des données pour les graphiques (utilise les vraies données)
  const performanceData = stats?.monthlyData || [
    { month: 'Jan', clients: 0, programs: 0, sessions: 0 },
    { month: 'Fév', clients: 0, programs: 0, sessions: 0 },
    { month: 'Mar', clients: 0, programs: 0, sessions: 0 },
    { month: 'Avr', clients: 0, programs: 0, sessions: 0 },
  ];

  const statsChartData = [
    { name: 'Clients actifs', value: stats?.activeClients || 0 },
    { name: 'Programmes publiés', value: stats?.publishedPrograms || 0 },
    { name: 'Sessions totales', value: stats?.totalSessions || 0 },
    { name: 'Exercices', value: stats?.totalExercises || 0 }
  ];

  // 📅 Données réelles pour les sessions du jour
  const todaySessionsData: SessionData[] = todaySessions.map(session => ({
    id: session.id,
    client: session.client,
    type: session.type,
    time: session.time,
    status: session.status
  }));

  const performanceMetrics = [
    { label: "Séances complétées", value: `${stats?.completionRate || 0}%`, percentage: stats?.completionRate || 0, color: "bg-blue-500" },
    { label: "Programmes publiés", value: `${stats?.publishRate || 0}%`, percentage: stats?.publishRate || 0, color: "bg-emerald-500" },
    { label: "Sessions ce mois", value: `${stats?.sessionsThisMonth || 0}`, percentage: Math.min((stats?.sessionsThisMonth || 0) / 10 * 100, 100), color: "bg-yellow-500" }
  ];

  // 🎯 Handlers
  const handleViewAllClients = () => {
    setSelectedTab('clients');
  };

  const handleClientDetails = (client: ClientData) => {
    console.log('Voir détails client:', client);
  };

  const handleViewCalendar = () => {
    setSelectedTab('calendar');
  };

  const handleSessionClick = (session: SessionData) => {
    console.log('Session cliquée:', session);
  };

  const handleNewClient = () => {
    console.log('Nouveau client');
  };

  const handleScheduleSession = () => {
    console.log('Planifier séance');
  };

  // Handlers pour les programmes
  const handleViewProgram = (program: any) => {
    setSelectedProgram(program);
    setActiveModal('view-program');
  };

  const handleEditProgram = (program: any) => {
    setSelectedProgram(program);
    setActiveModal('edit-program');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setSelectedProgram(null);
    setSelectedSessionId(null);
  };
  
  // Gestionnaires pour les actions sur les programmes
  const handleDeleteProgram = async () => {
    if (!confirmDialog.programId) return;
    
    try {
      await deleteProgram(confirmDialog.programId);
      setConfirmDialog({ isOpen: false, type: null, programId: null, programName: null });
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleDuplicateProgram = async () => {
    if (!confirmDialog.programId) return;
    
    try {
      await duplicateProgram(confirmDialog.programId);
      setConfirmDialog({ isOpen: false, type: null, programId: null, programName: null });
      handleCloseModal();
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  const openConfirmDialog = (type: 'delete-program' | 'duplicate-program', programId: string, programName: string) => {
    setConfirmDialog({
      isOpen: true,
      type,
      programId,
      programName
    });
  };

  // Gestionnaires pour la publication
  const handlePublishProgram = async (programId: string) => {
    try {
      await publishProgram(programId);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleUnpublishProgram = async (programId: string) => {
    try {
      await unpublishProgram(programId);
    } catch (error) {
      console.error('Erreur lors de la dépublication:', error);
    }
  };

  // Adaptateurs pour les types
  const handleClientDetailsAdapter = (client: ClientTableType) => {
    const clientData: ClientData = {
      id: client.id || '',
      name: client.name,
      email: '', // Pas disponible dans ClientTableType
      program: { name: client.program, level: '' },
      progress: client.progress,
      isActive: true // Valeur par défaut
    };
    handleClientDetails(clientData);
  };

  const handleSessionClickAdapter = (session: SessionType) => {
    const sessionData: SessionData = {
      id: session.id || '',
      client: session.client,
      type: session.type,
      time: session.time,
      status: session.status || 'upcoming'
    };
    handleSessionClick(sessionData);
  };

  // Transformation des données clients pour le tableau
  const clientsTableData: ClientTableType[] = clients.map(client => ({
    id: client.id,
    name: client.name,
    program: client.program?.name || 'Aucun programme',
    progress: client.progress
  }));

  // Transformation des données sessions pour le composant
  const sessionsForComponent: SessionType[] = todaySessionsData;

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
                  onViewDetails={handleClientDetailsAdapter}
                />
              )}

              {/* Daily Sessions */}
              <DailySessions
                sessions={sessionsForComponent}
                onViewCalendar={handleViewCalendar}
                onSessionClick={handleSessionClickAdapter}
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
                      <button 
                        onClick={() => handleViewProgram(program)}
                        className="flex-1 p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-sm"
                      >
                        Voir
                      </button>
                      <button 
                        onClick={() => setEditingProgram(program)}
                        className="flex-1 p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors text-sm"
                      >
                        Modifier
                      </button>
                    </div>
                    
                    {/* Menu d'actions pour le programme */}
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2 mb-2">
                        <button
                          onClick={() => openConfirmDialog('duplicate-program', program.id, program.name)}
                          className="flex-1 p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors text-sm flex items-center justify-center"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Dupliquer
                        </button>
                        <button
                          onClick={() => openConfirmDialog('delete-program', program.id, program.name)}
                          className="flex-1 p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors text-sm flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Supprimer
                        </button>
                      </div>
                      
                      {/* Bouton de publication */}
                      <div className="flex space-x-2">
                        {program.status === 'draft' ? (
                          <button
                            onClick={() => handlePublishProgram(program.id)}
                            disabled={isPublishing}
                            className="flex-1 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center disabled:opacity-50"
                          >
                            {isPublishing ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <Share className="h-3 w-3 mr-1" />
                            )}
                            Publier
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublishProgram(program.id)}
                            disabled={isUnpublishing}
                            className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center disabled:opacity-50"
                          >
                            {isUnpublishing ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <X className="h-3 w-3 mr-1" />
                            )}
                            Dépublier
                          </button>
                        )}
                      </div>
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
                                onClick={() => handleClientDetailsAdapter({
                                  id: client.id,
                                  name: client.name,
                                  program: client.program?.name || 'Aucun programme',
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

      {/* Modals */}
      {selectedProgram && (
        <>
          {/* Modal Vue Programme */}
          <ProgramOverview
            program={selectedProgram}
            sessions={programSessions || []}
            clientProgress={clientProgress || undefined}
            isOpen={activeModal === 'view-program'}
            onClose={handleCloseModal}
            onEdit={() => setActiveModal('edit-program')}
            onPublish={() => handlePublishProgram(selectedProgram.id)}
          />

          {/* Modal Édition Programme */}
          <ProgramSessionsManager
            program={selectedProgram}
            isOpen={activeModal === 'edit-program'}
            onClose={handleCloseModal}
          />
        </>
      )}

      {/* Formulaire d'édition du programme */}
      {editingProgram && (
        <EditProgramForm
          program={editingProgram}
          isOpen={!!editingProgram}
          onClose={() => setEditingProgram(null)}
          onSuccess={(updatedProgram: any) => {
            setEditingProgram(null);
            console.log('Programme mis à jour:', updatedProgram);
          }}
        />
      )}

      {/* Dialogue de confirmation pour les actions sur les programmes */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, programId: null, programName: null })}
        onConfirm={confirmDialog.type === 'delete-program' ? handleDeleteProgram : handleDuplicateProgram}
        title={
          confirmDialog.type === 'delete-program' 
            ? 'Supprimer le programme' 
            : 'Dupliquer le programme'
        }
        description={
          confirmDialog.type === 'delete-program'
            ? `Êtes-vous sûr de vouloir supprimer le programme "${confirmDialog.programName}" ? Cette action est irréversible et supprimera toutes les sessions et exercices associés.`
            : `Voulez-vous créer une copie du programme "${confirmDialog.programName}" ? Le nouveau programme sera en mode brouillon.`
        }
        confirmText={
          confirmDialog.type === 'delete-program' ? 'Supprimer' : 'Dupliquer'
        }
        variant={confirmDialog.type === 'delete-program' ? 'destructive' : 'default'}
        isLoading={isDeleting || isDuplicating}
      />
    </div>
  );
};