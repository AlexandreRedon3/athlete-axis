// src/components/coach/programs/program-overview.tsx
"use client"

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Target,
  TrendingUp,
  BarChart3,
  Dumbbell,
  Users,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Share,
  Download,
  Printer
} from 'lucide-react';
import { useTheme } from '../../../lib/theme-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rpe?: number;
  restSeconds?: number;
  order: number;
  category?: string;
}

interface Session {
  id: string;
  name: string;
  weekNumber: number;
  dayNumber: number;
  type: string;
  targetRPE: number;
  duration: number;
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
  coachId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ClientProgress {
  clientId: string;
  clientName: string;
  completedSessions: number;
  totalSessions: number;
  averageRPE: number;
  lastSessionDate?: Date;
  notes?: string;
}

interface ProgramOverviewProps {
  program: Program;
  sessions: Session[];
  clientProgress?: ClientProgress;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onPublish?: () => void;
}

export const ProgramOverview = ({ 
  program, 
  sessions, 
  clientProgress,
  isOpen, 
  onClose,
  onEdit,
  onPublish
}: ProgramOverviewProps) => {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');

  // Calculs des statistiques
  const totalSessions = sessions.length;
  const totalExercises = sessions.reduce((sum, session) => sum + session.exercises.length, 0);
  const avgRPE = sessions.length > 0 
    ? sessions.reduce((sum, session) => sum + session.targetRPE, 0) / sessions.length 
    : 0;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);

  // Calculs pour la progression client
  const completionRate = clientProgress 
    ? Math.round((clientProgress.completedSessions / clientProgress.totalSessions) * 100)
    : 0;

  const getRPEColor = (rpe: number) => {
    if (rpe <= 6) return 'text-green-600 bg-green-100';
    if (rpe <= 7) return 'text-yellow-600 bg-yellow-100';
    if (rpe <= 8) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins}min` : `${mins}min`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className={`${colors.text} text-2xl font-bold`}>{program.name}</h2>
                <p className={`${colors.textSecondary} text-sm mt-1`}>{program.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={program.status === 'published' ? 'default' : 'secondary'}>
                {program.status === 'published' ? 'Publié' : 'Brouillon'}
              </Badge>
              {program.status === 'draft' && onPublish && (
                <Button size="sm" onClick={onPublish}>
                  <Share className="h-4 w-4 mr-2" />
                  Publier
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="progression">Progression</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className={`${colors.textSecondary} text-sm`}>Sessions</p>
                      <p className={`${colors.text} text-2xl font-bold`}>{totalSessions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className={`${colors.textSecondary} text-sm`}>Exercices</p>
                      <p className={`${colors.text} text-2xl font-bold`}>{totalExercises}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className={`${colors.textSecondary} text-sm`}>RPE Moyen</p>
                      <p className={`${colors.text} text-2xl font-bold`}>{avgRPE.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className={`${colors.textSecondary} text-sm`}>Durée totale</p>
                      <p className={`${colors.text} text-2xl font-bold`}>{formatDuration(totalDuration)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progression et équilibre */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progression par semaine - Remplacée par progression de charge */}
              <div className={`${colors.cardBg} rounded-lg p-4 ${colors.border} border`}>
                <CardTitle className={`flex items-center space-x-2 ${colors.text}`}>
                  <TrendingUp className="h-5 w-5" />
                  <span>Progression de charge</span>
                </CardTitle>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Séances de max</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE >= 9).length} sessions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Séances de volume</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE >= 7 && s.targetRPE < 9).length} sessions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Séances de technique</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE < 7).length} sessions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Récupération active</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.duration < 45).length} sessions
                    </span>
                  </div>
                </div>
              </div>

              {/* Section Équilibre des sessions - Remplacée par des métriques plus pertinentes */}
              <div className={`${colors.cardBg} rounded-lg p-4 ${colors.border} border`}>
                <CardTitle className={`flex items-center space-x-2 ${colors.text}`}>
                  <BarChart3 className="h-5 w-5" />
                  <span>Répartition des charges</span>
                </CardTitle>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Intensité élevée (≥85%)</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE >= 8).length} sessions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Intensité modérée (70-85%)</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE >= 7 && s.targetRPE < 8).length} sessions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${colors.textSecondary} text-sm`}>Intensité légère (&lt;70%)</span>
                    <span className={`${colors.text} font-medium`}>
                      {sessions.filter(s => s.targetRPE < 7).length} sessions
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertes et recommandations */}
            {/* The alerts logic was removed, so this section is now empty */}

            {/* Progression client (si disponible) */}
            {clientProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Progression client</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{clientProgress.clientName}</p>
                      <p className="text-sm text-gray-600">
                        {clientProgress.completedSessions}/{clientProgress.totalSessions} sessions complétées
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getProgressColor(clientProgress.completedSessions, clientProgress.totalSessions)}`}>
                        {completionRate}%
                      </div>
                      <p className="text-sm text-gray-600">
                        RPE moy: {clientProgress.averageRPE.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  {clientProgress.lastSessionDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      Dernière session: {new Date(clientProgress.lastSessionDate).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Progression détaillée */}
          <TabsContent value="progression" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution de l'intensité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* The weeklyProgression logic was removed, so this section is now empty */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Liste des sessions */}
          <TabsContent value="sessions" className="space-y-6">
            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{session.name}</h4>
                        <p className="text-sm text-gray-600">
                          Semaine {session.weekNumber}, Jour {session.dayNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{session.type}</Badge>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRPEColor(session.targetRPE)}`}>
                          RPE {session.targetRPE}
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatDuration(session.duration)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Exercices */}
                    <div className="space-y-2">
                      {session.exercises.map((exercise, index) => (
                        <div key={exercise.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            <span>{exercise.name}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span>{exercise.sets} × {exercise.reps}</span>
                            {exercise.rpe && (
                              <span className={`px-2 py-1 rounded text-xs ${getRPEColor(exercise.rpe)}`}>
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
                    
                    {session.notes && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                        <strong>Notes:</strong> {session.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics avancées */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition des types */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des types de sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* The sessionTypeDistribution logic was removed, so this section is now empty */}
                  </div>
                </CardContent>
              </Card>

              {/* Métriques de performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques de performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Sessions par semaine</span>
                      <span className="font-medium">{program.sessionsPerWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Durée moyenne/session</span>
                      <span className="font-medium">{formatDuration(totalDuration / totalSessions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exercices moyens/session</span>
                      <span className="font-medium">{(totalExercises / totalSessions).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Charge de travail totale</span>
                      <span className="font-medium">{formatDuration(totalDuration)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            {onEdit && (
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier le programme
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 