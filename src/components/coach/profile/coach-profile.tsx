"use client"

import {
  Bell,
  Calendar,
  Edit3,
  Eye,
  Mail,
  MapPin,
  Phone,
  Save,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCoachStats } from "@/hooks/use-coach-stats";
import { useUpdateProfile } from "@/hooks/use-profile-actions";
import { useTheme } from "@/lib/theme-provider";

import { ProfileImageUpload } from "./profile-image-upload";

export type CoachUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  bio?: string | null;
  isCoach?: boolean | null;
  address?: string | null;
  zipCode?: string | null;
  city?: string | null;
  country?: string | null;
  phoneNumber?: string | null;
  emailNotifications?: boolean | null;
  smsNotifications?: boolean | null;
};

interface CoachProfileProps {
  user: CoachUser | null;
}

export const CoachProfile = ({ user }: CoachProfileProps) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const { stats } = useCoachStats();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const [currentImage, setCurrentImage] = useState(user?.image);

  const location = useMemo(() => {
    const parts = [user?.city, user?.zipCode, user?.country].filter(Boolean);
    return parts.join(", ");
  }, [user?.city, user?.zipCode, user?.country]);

  const [profileData, setProfileData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phoneNumber ?? "",
    location: location,
    bio: user?.bio ?? "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: !!user?.emailNotifications,
    smsNotifications: !!user?.smsNotifications,
    profileVisible: true,
    availableForNewClients: true,
  });

  const resolvedStats = [
    {
      label: "Clients actifs",
      value: String(stats?.activeClients ?? 0),
      icon: Users,
      color:
        "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      label: "Programmes créés",
      value: String(stats?.totalPrograms ?? 0),
      icon: Calendar,
      color:
        "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300",
    },
    {
      label: "Taux de réussite",
      value: `${stats?.completionRate ?? 0}%`,
      icon: TrendingUp,
      color:
        "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      label: "Note moyenne",
      value: "4.8",
      icon: Star,
      color:
        "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300",
    },
  ];

  const tabs = [
    { id: "personal", label: "Profil", icon: UserIcon },
    { id: "settings", label: "Paramètres", icon: Settings },
  ] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>(
    "personal",
  );

  const toggleSetting = (key: keyof typeof settings) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const ToggleSwitch = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  const handleSave = async () => {
    try {
      // Préparer les données pour l'API
      const [city, zipCode, country] = profileData.location.split(", ").map(s => s.trim());
      
      await updateProfile({
        name: profileData.name,
        phoneNumber: profileData.phone,
        bio: profileData.bio,
        city: city || undefined,
        zipCode: zipCode || undefined,
        country: country || undefined,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    // Restaurer les données d'origine
    setProfileData({
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phoneNumber ?? "",
      location: location,
      bio: user?.bio ?? "",
    });
    setSettings({
      emailNotifications: !!user?.emailNotifications,
      smsNotifications: !!user?.smsNotifications,
      profileVisible: true,
      availableForNewClients: true,
    });
    setIsEditing(false);
  };

  return (
    <div className={`w-full ${colors.bg}`}>
      <div className="max-w-5xl mx-auto">
        <div
          className={`${colors.cardBg} rounded-xl shadow-sm border ${colors.border} p-6 mb-6`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <ProfileImageUpload
              currentImage={currentImage}
              userName={profileData.name}
              onImageUpdate={setCurrentImage}
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className={`text-2xl font-bold ${colors.text}`}>
                    {profileData.name}
                  </h1>
                  <p className={`${colors.textSecondary}`}>
                    {user?.isCoach ? "Coach" : "Athlète"}
                  </p>
                </div>
                <Button
                  onClick={() => setIsEditing((v) => !v)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isEditing ? "Annuler" : "Modifier"}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {resolvedStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.color} mb-2`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className={`text-xl font-bold ${colors.text}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm ${colors.textSecondary}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${colors.cardBg} rounded-xl shadow-sm border ${colors.border} mb-6`}
        >
          <div className={`flex border-b ${colors.border}`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-600"
                    : `border-transparent ${colors.textSecondary} hover:text-emerald-600`
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <div className={`flex items-center gap-2 mt-2 ${colors.text}`}>
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <div className={`flex items-center gap-2 mt-2 ${colors.text}`}>
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{profileData.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <div className={`flex items-center gap-2 mt-2 ${colors.text}`}>
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{profileData.phone || "—"}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Localisation</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({ ...profileData, location: e.target.value })
                        }
                        className="mt-2"
                      />
                    ) : (
                      <div className={`flex items-center gap-2 mt-2 ${colors.text}`}>
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{profileData.location || "—"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biographie</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      className="mt-2"
                      placeholder="Parlez de votre expérience, vos spécialisations..."
                    />
                  ) : (
                    <div className={`${colors.cardBg} p-4 rounded-lg mt-2 border ${colors.border}`}>
                      {profileData.bio ? (
                        <p className={`${colors.text}`}>
                          {profileData.bio}
                        </p>
                      ) : (
                        <p className={`${colors.textSecondary} italic`}>
                          Aucune biographie renseignée
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {isUpdating ? "Sauvegarde..." : "Sauvegarder"}
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" /> Annuler
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className={`font-medium ${colors.text}`}>
                            Notifications email
                          </p>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            Recevoir les notifications par email
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.emailNotifications}
                        onChange={() => toggleSetting("emailNotifications")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className={`font-medium ${colors.text}`}>
                            Notifications SMS
                          </p>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            Recevoir les notifications par SMS
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={settings.smsNotifications}
                        onChange={() => toggleSetting("smsNotifications")}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
                    Confidentialité
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className={`font-medium ${colors.text}`}>Profil visible</p>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            Votre profil est visible publiquement
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={true}
                        onChange={() => {}}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className={`font-medium ${colors.text}`}>
                            Accepter de nouveaux clients
                          </p>
                          <p className={`text-sm ${colors.textSecondary}`}>
                            Vous êtes ouvert à de nouveaux clients
                          </p>
                        </div>
                      </div>
                      <ToggleSwitch
                        checked={true}
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
                    Sécurité
                  </h3>
                  <div className="space-y-4">
                    <button
                      className={`flex items-center gap-3 ${colors.text} hover:text-emerald-600 transition-colors`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Changer le mot de passe</span>
                    </button>
                    <button
                      className={`flex items-center gap-3 ${colors.text} hover:text-emerald-600 transition-colors`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Authentification à deux facteurs</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 