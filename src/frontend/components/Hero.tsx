"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function Hero() {
  const router = useRouter();
  const { login, logout, actor, isAuthenticated, userProfile, isLoading } =
    useAuth();

  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // --- Fungsi Login/Logout (sama dengan Header) ---
  const handleLogin = async () => {
    try {
      const newActor = await login();
      const exists = await newActor.isUserExists();

      if (!exists) {
        setShowModal(true);
        setCurrentStep(1);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Gagal login. Silakan coba lagi.");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setUsername("");
    setSelectedRole("");
    setError("");
    setIsSubmitting(false);
  };

  // --- Step 1: Username ---
  const handleUsernameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !actor) return;

    setIsSubmitting(true);
    setError("");
    try {
      const result = await actor.registerUser(username);
      if (result.ok) {
        setCurrentStep(2);
      } else {
        const errKey = Object.keys(result.err)[0];
        setError(`Gagal mendaftar: ${errKey}. Silakan coba username lain.`);
      }
    } catch (err) {
      console.error("Register user failed:", err);
      setError("Terjadi kesalahan saat mendaftar. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Step 2: Role ---
  const handleConfirmRole = async () => {
    if (!selectedRole || !actor) return;

    setIsSubmitting(true);
    setError("");
    try {
      const roleMap: any = {
        codes: { Codes: null },
        sports: { Sports: null },
        arts: { Arts: null },
        traveler: { Traveler: null },
        literature: { Literature: null },
      };

      const result = await actor.chooseRole(roleMap[selectedRole]);

      if ("ok" in result) {
        setShowModal(false);
        router.push("/dashboard");
      } else if ("err" in result) {
        const errKey = Object.keys(result.err)[0];
        setError(`Gagal memilih role: ${errKey}.`);
      } else {
        setError("Respon tidak terduga dari canister.");
      }
    } catch (err) {
      console.error("Choose role failed:", err);
      setError("Terjadi kesalahan saat memilih role. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToUsername = () => setCurrentStep(1);

  // --- Data Role sama dengan Header ---
  const roles = [
    {
      id: "codes",
      name: "Codes",
      badge: "/assets/badge_code.png",
      description:
        "Master of Technology - Ahli teknologi yang dapat memecahkan masalah kompleks dengan logika dan algoritma.",
    },
    {
      id: "sports",
      name: "Sports",
      badge: "/assets/badge_sports.png",
      description:
        "Champion of Physical Excellence - Atlet sejati yang menguasai kekuatan fisik dan ketahanan mental.",
    },
    {
      id: "arts",
      name: "Arts",
      badge: "/assets/badge_art.png",
      description:
        "Creator of Beauty - Seniman dengan kreativitas tanpa batas dan kemampuan ekspresi visual.",
    },
    {
      id: "traveler",
      name: "Traveler",
      badge: "/assets/badge_explorer.png",
      description:
        "Explorer of New Horizons - Petualang yang selalu mencari pengalaman baru.",
    },
    {
      id: "literature",
      name: "Literature",
      badge: "/assets/badge_literature.png",
      description:
        "Master of Words - Ahli komunikasi yang dapat menyampaikan ide dengan cara mudah dipahami.",
    },
  ];

  return (
    <>
      <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('assets/landing-bg.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/20 p-20 rounded-2xl border border-black backdrop-blur-sm">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 font-minecraft">
              Selamat Datang di
              <span className="block text-white">Habits Quest 4 Life</span>
            </h1>

            <p className="text-xl text-gray-800 mb-6 max-w-3xl mx-auto leading-relaxed font-minecraft">
              Jelajahi dunia fantasi yang penuh petualangan. Pilih peranmu, kembangkan karaktermu!
            </p>

            {/* Tombol Start pakai Internet Identity */}
            <div className="flex justify-center">
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="relative transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
              >
                <img
                  src="/assets/button.png"
                  alt="Mulai Petualangan"
                  className="w-auto h-16 sm:h-20 transition-all duration-200"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Registrasi (tampilan disamakan dengan Header) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div
            className={`relative bg-white rounded-2xl shadow-2xl mx-4 ${
              currentStep === 1
                ? "w-full max-w-md p-8"
                : "w-full max-w-4xl p-8"
            }`}
          >
            {/* Step Indicator */}
            <div className="text-center mb-12">
              <div className="flex justify-center items-center mb-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 1
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep >= 2 ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 2
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2 font-minecraft">
                {currentStep === 1 ? "Buat Username" : "Pilih Role"}
              </h2>
              {error && (
                <p className="text-red-500 bg-red-100 p-2 rounded mb-4">
                  {error}
                </p>
              )}
            </div>

            {/* Step 1 */}
            {currentStep === 1 && (
              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 font-minecraft"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !username.trim()}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg font-minecraft"
                >
                  {isSubmitting ? "Mengecek..." : "Lanjutkan"}
                </button>
              </form>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div className="space-y-8 max-h-[67.5vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedRole === role.id
                          ? "ring-4 ring-orange-500 ring-offset-4 rounded-xl"
                          : ""
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110">
                        <img
                          src={role.badge}
                          alt={role.name}
                          className="w-24 h-24 object-contain"
                        />
                      </div>
                      <h3
                        className={`text-lg font-semibold text-center mb-3 font-minecraft ${
                          selectedRole === role.id
                            ? "text-orange-600 font-bold"
                            : "text-gray-900 group-hover:text-gray-700"
                        }`}
                      >
                        {role.name}
                      </h3>
                      <p className="text-sm text-gray-600 text-center font-minecraft">
                        {role.description}
                      </p>
                    </div>
                  ))}
                </div>

                {selectedRole && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700 mb-3 font-minecraft">
                      <span className="font-semibold">Role dipilih:</span>
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={roles.find((r) => r.id === selectedRole)?.badge}
                        alt={roles.find((r) => r.id === selectedRole)?.name}
                        className="w-16 h-16 object-contain"
                      />
                      <span className="text-lg font-bold text-gray-900 font-minecraft">
                        {roles.find((r) => r.id === selectedRole)?.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 sticky bottom-0 bg-white pt-6 border-t border-gray-200">
                  <button
                    onClick={goBackToUsername}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-minecraft"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleConfirmRole}
                    disabled={isSubmitting || !selectedRole}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg font-minecraft"
                  >
                    {isSubmitting ? "Menyimpan..." : "Konfirmasi & Mulai"}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
