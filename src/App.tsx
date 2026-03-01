/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import MatrixBackground from './components/MatrixBackground';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import ThreatMapSection from './components/ThreatMapSection';
import StatsSection from './components/StatsSection';
import DashboardDemo from './components/DashboardDemo';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AIBot from './components/AIBot';
import ScannerTab from './components/ScannerTab';
import ResourcesTab from './components/ResourcesTab';
import LoginTab from './components/LoginTab';
import SimulationTab from './components/SimulationTab';

export default function App() {
  return (
    <Router>
      <div className="bg-[#0a0a0f] min-h-screen text-white font-sans selection:bg-[#00f2ff] selection:text-black flex flex-col">
        <Loader />
        <CustomCursor />
        <MatrixBackground />
        <Navbar />
        
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={
              <>
                <HeroSection />
                <AboutSection />
                <ServicesSection />
                <ThreatMapSection />
                <StatsSection />
                <DashboardDemo />
                <ContactSection />
              </>
            } />
            <Route path="/scanner" element={<ScannerTab />} />
            <Route path="/ai" element={<AIBot />} />
            <Route path="/resources" element={<ResourcesTab />} />
            <Route path="/login" element={<LoginTab />} />
            <Route path="/simulation" element={<SimulationTab />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

