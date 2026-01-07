import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/mobile-responsive.css"; // Global mobile styles
import LandingPage from "./pages/landing/Landing.jsx";
import NotFound from "./pages/NotFound.jsx";

// Import Admin Pages
import AccessControl from "./pages/admin/AccessControl.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Users from "./pages/admin/Users.jsx";
import AdLogin from "./pages/admin/AdLogin.jsx";

import AdSettings from "./pages/admin/AdSettings.jsx";



import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import MainDashboard from "./pages/auth/MainDashboard.jsx";


// Import Agriculture Modules
import AgricultureLayout from "./pages/agriculture/AgricultureLayout.jsx";
import FarmDashboard from "./pages/agriculture/Dashboard.jsx";
import CropDiseaseDetection from "./pages/agriculture/CropDiseaseDetection.jsx";
import WeatherForecast from "./pages/agriculture/WeatherForecast.jsx";
import SmartIrrigation from "./pages/agriculture/SmartIrrigation.jsx";
import FarmAutomation from "./pages/agriculture/FarmAutomation.jsx";
import MarketForecast from "./pages/agriculture/MarketForecast.jsx";
import SupplyChain from "./pages/agriculture/SupplyChain.jsx";
import PestControl from "./pages/agriculture/PestControl.jsx";
import AgriReports from "./pages/agriculture/Reports.jsx";
import CommunityHub from "./pages/agriculture/CommunityHub.jsx";
import Profile from "./pages/agriculture/Profile.jsx";

// Import Environment Modules
import EnvironmentLayout from "./pages/environment/EnvironmentLayout.jsx";
import EnvProfile from "./pages/environment/Profile.jsx";
import AwarenessHub from "./pages/environment/AwarenessHub.jsx";
import CarbonCalculator from "./pages/environment/CarbonCalculator.jsx";
// import EnvChatbot from "./pages/environment/Chatbot.jsx"; // Removed non-existent resource
import ClimatePredictions from "./pages/environment/ClimatePredictions.jsx";
import EnvDashboard from "./pages/environment/Dashboard.jsx";
import DisasterPrediction from "./pages/environment/DisasterPrediction.jsx";
import PollutionHeatmap from "./pages/environment/PollutionHeatmap.jsx";
import RenewableEnergy from "./pages/environment/RenewableEnergy.jsx";
import EnvReports from "./pages/environment/Reports.jsx";
// import EnvSettings from "./pages/environment/Settings.jsx";  // Removed unused import
import WasteManagement from "./pages/environment/WasteManagement.jsx";
import WildlifeConservation from "./pages/environment/WildlifeConservation.jsx";

// Import Healthcare Modules
import CareBookings from "./pages/healthcare/CareBookings.jsx";
import HealthOverview from "./pages/healthcare/HealthOverview.jsx";
import SymptomChecker from "./pages/healthcare/SymptomChecker.jsx";
import HealthRisks from "./pages/healthcare/HealthRisks.jsx";
import MyScans from "./pages/healthcare/MyScans.jsx";
import MyMedsCare from "./pages/healthcare/MyMedsCare.jsx";
import MyMedicalVault from "./pages/healthcare/MyMedicalVault.jsx";
import VitalsHub from "./pages/healthcare/VitalsHub.jsx";
import MyHealthReports from "./pages/healthcare/MyHealthReports.jsx";

import MyConsultations from "./pages/healthcare/MyConsultations.jsx";
import MyProfile from "./pages/healthcare/MyProfile.jsx";
import HealthcareLayout from "./pages/healthcare/HealthcareLayout.jsx";

// Simple Placeholder Chat Page
const ChatPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl">
    Chat Page (Coming soon...)
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/dashboard" element={<MainDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/access-control" element={<AccessControl />} />
        <Route path="/admin/settings" element={<AdSettings />} />

        {/* Agriculture Routes */}
        <Route path="/agriculture" element={<AgricultureLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<FarmDashboard />} />
          <Route path="community" element={<CommunityHub />} />
          <Route path="crop-disease" element={<CropDiseaseDetection />} />
          <Route path="automation" element={<FarmAutomation />} />
          <Route path="market" element={<MarketForecast />} />
          <Route path="pest-control" element={<PestControl />} />
          <Route path="reports" element={<AgriReports />} />
          <Route path="irrigation" element={<SmartIrrigation />} />
          <Route path="supply-chain" element={<SupplyChain />} />
          <Route path="weather" element={<WeatherForecast />} />
          <Route path="profile" element={<Profile />} />
        </Route>


        {/* Environment Routes */}
        <Route path="/environment" element={<EnvironmentLayout />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<EnvProfile />} />
          <Route path="dashboard" element={<EnvDashboard />} />
          <Route path="awareness" element={<AwarenessHub />} />
          <Route path="carbon" element={<CarbonCalculator />} />
          {/* <Route path="chatbot" element={<EnvChatbot />} /> */}
          <Route path="climate" element={<ClimatePredictions />} />
          <Route path="disaster" element={<DisasterPrediction />} />
          <Route path="pollution" element={<PollutionHeatmap />} />
          <Route path="renewable" element={<RenewableEnergy />} />
          <Route path="reports" element={<EnvReports />} />
          <Route path="waste" element={<WasteManagement />} />
          <Route path="wildlife" element={<WildlifeConservation />} />

        </Route>

        {/* Healthcare Routes */}
        <Route path="/healthcare" element={<HealthcareLayout />}>
          <Route path="overview" element={<HealthOverview />} />
          <Route path="bookings" element={<CareBookings />} />
          <Route path="symptom-checker" element={<SymptomChecker />} />
          <Route path="health-risks" element={<HealthRisks />} />
          <Route path="my-scans" element={<MyScans />} />
          <Route path="my-meds" element={<MyMedsCare />} />
          <Route path="medical-vault" element={<MyMedicalVault />} />
          <Route path="vitals-hub" element={<VitalsHub />} />
          <Route path="health-reports" element={<MyHealthReports />} />

          <Route path="consultations" element={<MyConsultations />} />
          <Route path="profile" element={<MyProfile />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
