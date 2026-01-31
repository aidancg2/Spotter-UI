import { useState } from "react";
import {
  Home,
  Trophy,
  Users,
  MapPin,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Feed } from "./components/Feed";
import { Leaderboard } from "./components/Leaderboard";
import { Profile } from "./components/Profile";
import { Map } from "./components/Map";
import { Groups } from "./components/Groups";
import { Header } from "./components/Header";
import {
  QuickCheckinModal,
  PostModal,
} from "./components/Modals";
import { Login } from "./components/Login";
import { SignUp, SignUpData } from "./components/SignUp";
import { Preferences, UserPreferences } from "./components/Preferences";

type Tab =
  | "feed"
  | "map"
  | "leaderboard"
  | "groups"
  | "profile";
type ModalType = "checkin" | "post" | null;
type AuthScreen = "login" | "signup" | "preferences" | "app";

export default function MainApp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [activeModal, setActiveModal] =
    useState<ModalType>(null);
  const [showWorkoutMenu, setShowWorkoutMenu] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);

  // Show authentication screens if not logged in
  if (authScreen === "login") {
    return (
      <Login
        onLogin={() => setAuthScreen("app")}
        onSignUpClick={() => setAuthScreen("signup")}
      />
    );
  }

  if (authScreen === "signup") {
    return (
      <SignUp
        onSignUp={(data) => {
          setSignUpData(data);
          setAuthScreen("preferences");
        }}
        onBack={() => setAuthScreen("login")}
      />
    );
  }

  if (authScreen === "preferences" && signUpData) {
    return (
      <Preferences
        displayName={signUpData.displayName}
        onComplete={(preferences: UserPreferences) => {
          console.log("User preferences:", preferences);
          console.log("Sign up data:", signUpData);
          setAuthScreen("app");
        }}
        onSkip={() => setAuthScreen("app")}
      />
    );
  }

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setShowPlusMenu(false);
  };

  const openLogWorkoutMenu = () => {
    // We'll navigate to a workout menu or directly start
    setShowPlusMenu(false);
    // For now, open the workout modal that shows options
    setShowWorkoutMenu(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Header
        onProfileClick={() => setActiveTab("profile")}
        showSearch={activeTab === "feed"}
      />

      <main className="pb-20">
        {activeTab === "feed" && <Feed />}
        {activeTab === "map" && <Map />}
        {activeTab === "leaderboard" && <Leaderboard />}
        {activeTab === "groups" && <Groups />}
        {activeTab === "profile" && <Profile />}
      </main>

      {/* Modals */}
      <QuickCheckinModal
        isOpen={activeModal === "checkin"}
        onClose={() => setActiveModal(null)}
      />
      <PostModal
        isOpen={activeModal === "post"}
        onClose={() => setActiveModal(null)}
      />

      {/* Workout Menu Modal */}
      {showWorkoutMenu && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 rounded-2xl max-w-md w-full border border-neutral-800 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h2 className="text-xl font-bold">Log Workout</h2>
              <button
                onClick={() => setShowWorkoutMenu(false)}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 overflow-y-auto">
              {/* Quick Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowWorkoutMenu(false);
                    navigate("/workout/new");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg hover:border-orange-500/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold mb-1">
                        Start Empty Workout
                      </div>
                      <div className="text-sm text-neutral-400">
                        Build your workout from scratch
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowWorkoutMenu(false);
                    navigate("/workout/templates");
                  }}
                  className="w-full p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold mb-1">
                        Choose Template
                      </div>
                      <div className="text-sm text-neutral-400">
                        Start from a saved routine
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>

              {/* Stats */}
              <div className="pt-2">
                <h3 className="font-semibold mb-3">
                  This Week
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      4
                    </div>
                    <div className="text-xs text-neutral-400">
                      Workouts
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      5.2h
                    </div>
                    <div className="text-xs text-neutral-400">
                      Total Time
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-400">
                      142
                    </div>
                    <div className="text-xs text-neutral-400">
                      Total Sets
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Workouts */}
              <div className="pt-2">
                <h3 className="font-semibold mb-3">
                  Recent Workouts
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      name: "Push Day",
                      id: "1",
                      daysAgo: 1,
                      duration: "1h 15m",
                    },
                    {
                      name: "Leg Day",
                      id: "2",
                      daysAgo: 3,
                      duration: "1h 20m",
                    },
                    {
                      name: "Pull Day",
                      id: "3",
                      daysAgo: 5,
                      duration: "1h 25m",
                    },
                    {
                      name: "Upper Body",
                      id: "4",
                      daysAgo: 7,
                      duration: "1h 30m",
                    },
                  ].map((workout) => (
                    <button
                      key={workout.id}
                      onClick={() => {
                        setShowWorkoutMenu(false);
                        navigate(
                          `/workout/recent/${workout.id}`,
                        );
                      }}
                      className="w-full p-3 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-neutral-600 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {workout.name}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {workout.daysAgo} days ago
                          </div>
                        </div>
                        <div className="text-sm text-neutral-500">
                          {workout.duration}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plus Menu Popup */}
      {showPlusMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowPlusMenu(false)}
        >
          <div
            className="absolute bottom-20 left-1/2 -translate-x-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vertical Menu */}
            <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-4 flex flex-col gap-3">
              <button
                onClick={() => openModal("checkin")}
                className="flex items-center gap-3 group hover:bg-neutral-700 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-cyan-500 hover:bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  Quick Check-in
                </span>
              </button>

              <button
                onClick={() => openModal("post")}
                className="flex items-center gap-3 group hover:bg-neutral-700 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500 hover:bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  Post
                </span>
              </button>

              <button
                onClick={openLogWorkoutMenu}
                className="flex items-center gap-3 group hover:bg-neutral-700 p-3 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">
                  Log Workout
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-30">
        <div className="max-w-lg mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => setActiveTab("feed")}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              activeTab === "feed"
                ? "text-cyan-400"
                : "text-neutral-400"
            }`}
          >
            <Home size={24} />
            <span className="text-xs">Feed</span>
          </button>

          <button
            onClick={() => setActiveTab("map")}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              activeTab === "map"
                ? "text-cyan-400"
                : "text-neutral-400"
            }`}
          >
            <MapPin size={24} />
            <span className="text-xs">Gyms</span>
          </button>

          {/* Middle Plus Button */}
          <button
            onClick={() => setShowPlusMenu(!showPlusMenu)}
            className="flex flex-col items-center gap-1 px-3 py-2 -mt-6"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                showPlusMenu
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600"
              }`}
            >
              <Plus
                size={28}
                className={`text-white transition-transform ${showPlusMenu ? "rotate-0" : ""}`}
              />
            </div>
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              activeTab === "leaderboard"
                ? "text-cyan-400"
                : "text-neutral-400"
            }`}
          >
            <Trophy size={24} />
            <span className="text-xs">Ranks</span>
          </button>

          <button
            onClick={() => setActiveTab("groups")}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              activeTab === "groups"
                ? "text-cyan-400"
                : "text-neutral-400"
            }`}
          >
            <Users size={24} />
            <span className="text-xs">Groups</span>
          </button>
        </div>
      </nav>
    </div>
  );
}