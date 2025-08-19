// src/components/coach/programs/program-sessions-manager.tsx
"use client"

import { 
  AlertCircle,
  Calendar, 
  ChevronDown,
  ChevronRight,
  Clock, 
  Copy,
  Dumbbell,
  Edit,
  MoreVertical,
  Plus, 
  Share,
  Target,
  Trash2,
  TrendingUp,
  X
} from 'lucide-react';
import { useState } from 'react';

import { useDeleteSession, useDuplicateSession, usePublishProgram } from '../../../hooks/use-program-actions';
import { useProgramSessions } from '../../../hooks/use-program-sessions';
import { useTheme } from '../../../lib/theme-provider';
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { ConfirmDialog } from '../../ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { AddExerciseToProgramForm } from '../forms/add-exercise-to-program-form';
import { AddSessionForm } from '../forms/add-session-form';
import { EditProgramForm } from '../forms/edit-program-form';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  order: number;
}

interface Session {
  id: string;
  name: string;
  weekNumber: number;
  dayNumber: number;
  type: string; // 'Push', 'Pull', 'Legs', 'Full Body', etc.
  targetRPE: number;
  duration: number; // en minutes
  exercises: Exercise[];
  notes?: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  type: string;
  level: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  status: 'published' | 'draft';
}

interface ProgramSessionsManagerProps {
  program: Program;
  isOpen: boolean;
  onClose: () => void;
}

export const ProgramSessionsManager = ({ 
  program, 
  isOpen, 
  onClose 
}: ProgramSessionsManagerProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([1]);
  const [showEditProgram, setShowEditProgram] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'delete-session' | 'duplicate-session' | null;
    sessionId: string | null;
    sessionName: string | null;
  }>({
    isOpen: false,
    type: null,
    sessionId: null,
    sessionName: null
  });
  const { colors } = useTheme();

  // Hooks pour les actions
  const { deleteSession, isDeleting } = useDeleteSession();
  const { duplicateSession, isDuplicating } = useDuplicateSession();
  const { publishProgram, unpublishProgram, isPublishing, isUnpublishing } = usePublishProgram();

  // Hook pour récupérer les sessions du programme
  const { 
    sessions, 
    isLoading, 
    error, 
    refetch 
  } = useProgramSessions(program.id);

  // Organiser les sessions par semaines
  const sessionsByWeek = sessions.reduce((acc, session) => {
    if (!acc[session.weekNumber]) {
      acc[session.weekNumber] = [];
    }
    acc[session.weekNumber].push(session);
    return acc;
  }, {} as Record<number, Session[]>);

  // Calculs statistiques
  const totalExercises = sessions.reduce((sum, session) => sum + session.exercises.length, 0);
  const avgRPE = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.targetRPE, 0) / sessions.length 
    : 0;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks(prev => 
      prev.includes(weekNumber) 
        ? prev.filter(w => w !== weekNumber)
        : [...prev, weekNumber]
    );
  };

  const getRPEColor = (rpe: number) => {
    if (rpe <= 6) return 'bg-green-500';
    if (rpe <= 7) return 'bg-yellow-500';
    if (rpe <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins}min` : `${mins}min`;
  };

  // Gestionnaires pour les actions
  const handleDeleteSession = async () => {
    if (!confirmDialog.sessionId) return;
    
    try {
      await deleteSession({ programId: program.id, sessionId: confirmDialog.sessionId });
      setConfirmDialog({ isOpen: false, type: null, sessionId: null, sessionName: null });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleDuplicateSession = async () => {
    if (!confirmDialog.sessionId) return;
    
    try {
      await duplicateSession({ programId: program.id, sessionId: confirmDialog.sessionId });
      setConfirmDialog({ isOpen: false, type: null, sessionId: null, sessionName: null });
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
    }
  };

  const openConfirmDialog = (type: 'delete-session' | 'duplicate-session', sessionId: string, sessionName: string) => {
    setConfirmDialog({
      isOpen: true,
      type,
      sessionId,
      sessionName
    });
  };

  // Gestionnaires pour la publication
  const handlePublishProgram = async () => {
    try {
      await publishProgram(program.id);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    }
  };

  const handleUnpublishProgram = async () => {
    try {
      await unpublishProgram(program.id);
    } catch (error) {
      console.error('Erreur lors de la dépublication:', error);
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className={`${colors.text} text-xl font-bold`}>{program.name}</h2>
                    <p className={`${colors.textSecondary} text-sm mt-1`}>
                      Gestion des sessions et exercices
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowEditProgram(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Button>
                  
                  {/* Bouton de publication */}
                  {program.status === 'draft' ? (
                    <Button
                      onClick={handlePublishProgram}
                      disabled={isPublishing}
                      size="sm"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center space-x-2"
                    >
                      {isPublishing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      ) : (
                        <Share className="h-4 w-4" />
                      )}
                      <span>Publier</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleUnpublishProgram}
                      disabled={isUnpublishing}
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      {isUnpublishing ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <span>Dépublier</span>
                    </Button>
                  )}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Statistiques du programme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className={`${colors.textSecondary} text-sm`}>Sessions</p>
                    <p className={`${colors.text} text-lg font-bold`}>
                      {isLoading ? '...' : sessions.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className={`${colors.textSecondary} text-sm`}>Exercices</p>
                    <p className={`${colors.text} text-lg font-bold`}>
                      {isLoading ? '...' : totalExercises}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className={`${colors.textSecondary} text-sm`}>RPE Moyen</p>
                    <p className={`${colors.text} text-lg font-bold`}>
                      {isLoading ? '...' : avgRPE.toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className={`${colors.textSecondary} text-sm`}>Durée totale</p>
                    <p className={`${colors.text} text-lg font-bold`}>
                      {isLoading ? '...' : formatDuration(totalDuration)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bouton d'ajout de session */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`${colors.text} text-lg font-semibold`}>Sessions par semaine</h3>
            <Button
              onClick={() => setActiveModal('add-session')}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une session
            </Button>
          </div>

          {/* Sessions organisées par semaines */}
          {isLoading ? (
            <div className={`text-center py-12 ${colors.cardBg} rounded-lg ${colors.border} border`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`${colors.textSecondary}`}>Chargement des sessions...</p>
            </div>
          ) : error ? (
            <div className={`text-center py-12 ${colors.cardBg} rounded-lg ${colors.border} border`}>
              <div className="text-red-500 mb-4">
                <AlertCircle className="h-8 w-8 mx-auto" />
              </div>
              <h3 className={`${colors.text} font-semibold mb-2`}>Erreur de chargement</h3>
              <p className={`${colors.textSecondary} mb-4`}>{error}</p>
              <Button onClick={refetch} variant="outline">
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.keys(sessionsByWeek).map(weekNum => {
                const weekNumber = parseInt(weekNum);
                const weekSessions = sessionsByWeek[weekNumber];
                const weekAvgRPE = weekSessions.reduce((sum, s) => sum + s.targetRPE, 0) / weekSessions.length;
                const isExpanded = expandedWeeks.includes(weekNumber);

                return (
                  <Card key={weekNumber} className="overflow-hidden">
                    <CardHeader 
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${colors.hover}`}
                      onClick={() => toggleWeek(weekNumber)}
                    >
                      <CardTitle className={`flex items-center justify-between ${colors.text}`}>
                        <div className="flex items-center space-x-3">
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <span>Semaine {weekNumber}</span>
                          <Badge variant="outline">
                            {weekSessions.length} séances
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${getRPEColor(weekAvgRPE)}`} />
                            <span className={`text-sm ${colors.textSecondary}`}>
                              RPE {weekAvgRPE.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Progression indicator */}
                        {weekNumber > 1 && (
                          <div className="flex items-center space-x-1 text-sm text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span>Progression</span>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="grid gap-3">
                          {weekSessions
                            .sort((a, b) => a.dayNumber - b.dayNumber)
                            .map((session) => (
                            <div
                              key={session.id}
                              className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${colors.border} ${colors.hover}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-sm font-bold text-blue-600">
                                      {session.dayNumber}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold ${colors.text}`}>{session.name}</h4>
                                    <div className="flex items-center space-x-4 text-sm">
                                      <span className={`flex items-center ${colors.textSecondary}`}>
                                        <Clock className="h-3 w-3 mr-1" />
                                        {formatDuration(session.duration)}
                                      </span>
                                      <span className={`flex items-center ${colors.textSecondary}`}>
                                        <Target className="h-3 w-3 mr-1" />
                                        RPE {session.targetRPE}
                                      </span>
                                      <Badge variant="secondary" className="text-xs">
                                        {session.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className={`${colors.textSecondary}`}>
                                    {session.exercises.length} exercices
                                  </Badge>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedSessionId(session.id);
                                      setActiveModal('add-exercise');
                                    }}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Exercice
                                  </Button>
                                  
                                  {/* Menu d'actions pour la session */}
                                  <div className="relative">
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        // Toggle menu d'actions
                                      }}
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                    
                                    {/* Menu déroulant des actions */}
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                      <div className="py-1">
                                        <button
                                          onClick={() => openConfirmDialog('duplicate-session', session.id, session.name)}
                                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                          <Copy className="h-4 w-4 mr-2" />
                                          Dupliquer
                                        </button>
                                        <button
                                          onClick={() => openConfirmDialog('delete-session', session.id, session.name)}
                                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Supprimer
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Liste des exercices */}
                              {session.exercises.length > 0 && (
                                <div className="space-y-2">
                                  {session.exercises
                                    .sort((a, b) => a.order - b.order)
                                    .map((exercise, index) => (
                                    <div
                                      key={exercise.id || `${session.id}-exercise-${index}`}
                                      className={`flex items-center justify-between p-2 bg-gray-50 rounded text-sm ${colors.cardBg}`}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                                          {index + 1}
                                        </span>
                                        <span className={`font-medium ${colors.text}`}>{exercise.name}</span>
                                      </div>
                                      
                                      <div className={`flex items-center space-x-4 ${colors.textSecondary}`}>
                                        <span>{exercise.sets} × {exercise.reps}</span>
                                        {exercise.rpe && (
                                          <span className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-1 ${getRPEColor(exercise.rpe)}`} />
                                            RPE {exercise.rpe}
                                          </span>
                                        )}
                                        {exercise.restSeconds && (
                                          <span>{Math.floor(exercise.restSeconds / 60)}min</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {session.notes && (
                                <div className={`mt-3 p-2 bg-blue-50 rounded text-sm ${colors.cardBg}`}>
                                  <strong className={colors.text}>Notes:</strong> <span className={colors.textSecondary}>{session.notes}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}

          {/* Message si pas de sessions */}
          {!isLoading && !error && sessions.length === 0 && (
            <div className={`text-center py-12 border-2 border-dashed border-gray-300 rounded-lg ${colors.border}`}>
              <Calendar className={`h-12 w-12 ${colors.textSecondary} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                Aucune session créée
              </h3>
              <p className={`${colors.textSecondary} mb-4`}>
                Commencez par ajouter des sessions à votre programme
              </p>
              <Button
                onClick={() => setActiveModal('add-session')}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Créer ma première session
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals pour ajouter session et exercices */}
      <AddSessionForm
        isOpen={activeModal === 'add-session'}
        onClose={() => setActiveModal(null)}
        program={program}
        onSuccess={(session: any) => {
          setActiveModal(null);
          refetch(); // Rafraîchir les données
        }}
      />

      <AddExerciseToProgramForm
        isOpen={activeModal === 'add-exercise'}
        onClose={() => setActiveModal(null)}
        preselectedProgramId={program.id}
        preselectedSessionId={selectedSessionId || undefined}
        onSuccess={(exercise: any) => {
          setActiveModal(null);
          refetch(); // Rafraîchir les données
        }}
      />

      {/* Formulaire d'édition du programme */}
      <EditProgramForm
        program={program}
        isOpen={showEditProgram}
        onClose={() => setShowEditProgram(false)}
        onSuccess={(updatedProgram: any) => {
          setShowEditProgram(false);
          // Mettre à jour le programme localement si nécessaire
          console.log('Programme mis à jour:', updatedProgram);
        }}
      />

      {/* Dialogue de confirmation pour les actions */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, type: null, sessionId: null, sessionName: null })}
        onConfirm={confirmDialog.type === 'delete-session' ? handleDeleteSession : handleDuplicateSession}
        title={
          confirmDialog.type === 'delete-session' 
            ? 'Supprimer la session' 
            : 'Dupliquer la session'
        }
        description={
          confirmDialog.type === 'delete-session'
            ? `Êtes-vous sûr de vouloir supprimer la session "${confirmDialog.sessionName}" ? Cette action est irréversible.`
            : `Voulez-vous créer une copie de la session "${confirmDialog.sessionName}" ?`
        }
        confirmText={
          confirmDialog.type === 'delete-session' ? 'Supprimer' : 'Dupliquer'
        }
        variant={confirmDialog.type === 'delete-session' ? 'destructive' : 'default'}
        isLoading={isDeleting || isDuplicating}
      />
    </div>
  );
};