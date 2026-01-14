import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const AUTH_PAGE_STATES = {
  SIGN_IN: "SIGN_IN",
  LOADING: "LOADING",
} as const;

type AuthPageState = (typeof AUTH_PAGE_STATES)[keyof typeof AUTH_PAGE_STATES];

interface AuthFormData {
  email: string;
  password: string;
  otp?: string;
  newPassword?: string;
}

interface AuthPageStore {
  currentPage: AuthPageState;
  previousPage: AuthPageState | null;

  formData: AuthFormData;
  // Timer state
  resendTimer: number;
  resendEndTime: number | null;
  setCurrentPage: (page: AuthPageState) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setOtp: (otp: string) => void;

  setNewPassword: (newPassword: string) => void;
  updateFormData: (data: Partial<AuthFormData>) => void;
  resetFormData: () => void;
  // Timer actions
  startResendTimer: () => void;
  updateResendTimer: (seconds: number) => void;
  resetResendTimer: () => void;
  resetAll: () => void;
  resetPages: () => void;
}

const initialFormData: AuthFormData = {
  email: "",
  password: "",
  otp: "",
  newPassword: "",
};

const initialState = {
  currentPage: AUTH_PAGE_STATES.SIGN_IN as AuthPageState,
  previousPage: null as AuthPageState | null,
  formData: initialFormData,
  resendTimer: 0,
  resendEndTime: null,
};

export const useAuthPageStore = create<AuthPageStore>()(
  persist(
    (set, _get, _store) => ({
      ...initialState,

      setCurrentPage: (page) =>
        set((state) => ({
          previousPage: state.currentPage, // Store current page as previous
          currentPage: page, // Set new current page
        })),

      setEmail: (email) =>
        set((state) => ({
          formData: { ...state.formData, email },
        })),

      setPassword: (password) =>
        set((state) => ({
          formData: { ...state.formData, password },
        })),

      setOtp: (otp) =>
        set((state) => ({
          formData: { ...state.formData, otp },
        })),


      setNewPassword: (newPassword) =>
        set((state) => ({
          formData: { ...state.formData, newPassword },
        })),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetFormData: () =>
        set({
          formData: initialFormData,
        }),

      // Timer actions
      startResendTimer: () => {
        const endTime = Date.now() + 60_000; // 60 seconds from now
        set({
          resendTimer: 60,
          resendEndTime: endTime,
        });
      },

      updateResendTimer: (seconds) =>
        set({
          resendTimer: seconds,
        }),

      resetResendTimer: () =>
        set({
          resendTimer: 0,
          resendEndTime: null,
        }),

      resetAll: () => set(initialState),
      resetPages: () =>
        set({ currentPage: AUTH_PAGE_STATES.SIGN_IN, previousPage: null }),
    }),
    {
      name: "auth-page-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentPage: state.currentPage,
        previousPage: state.previousPage,
        formData: state.formData,
        resendTimer: state.resendTimer,
        resendEndTime: state.resendEndTime,
      }),
    }
  )
);
