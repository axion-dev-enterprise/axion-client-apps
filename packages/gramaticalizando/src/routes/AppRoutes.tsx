import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from '../layouts/LandingLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { ProfessorLayout } from '../layouts/ProfessorLayout';

import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { StudentDashboard } from '../pages/student/StudentDashboard';
import { StudentPortugues } from '../pages/student/StudentPortugues';
import { StudentSimulados } from '../pages/student/StudentSimulados';
import { StudentRedacao } from '../pages/student/StudentRedacao';
import { StudentCronograma } from '../pages/student/StudentCronograma';
import { StudentMateriais } from '../pages/student/StudentMateriais';
import { StudentVideoaulas } from '../pages/student/StudentVideoaulas';
import { StudentDiagnostico } from '../pages/student/StudentDiagnostico';

import { ProfessorDashboard } from '../pages/professor/ProfessorDashboard';
import { ProfessorAlunos } from '../pages/professor/ProfessorAlunos';
import { ProfessorRedacoes } from '../pages/professor/ProfessorRedacoes';
import { ProfessorAulas } from '../pages/professor/ProfessorAulas';
import { ProfessorExercicios } from '../pages/professor/ProfessorExercicios';
import { ProfessorSimulados } from '../pages/professor/ProfessorSimulados';
import { ProfessorDiagnostico } from '../pages/professor/ProfessorDiagnostico';
import { ProfessorMateriais } from '../pages/professor/ProfessorMateriais';

import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas da Landing Page */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/diagnostico" element={<StudentDiagnostico />} />
      </Route>

      {/* Rotas de Autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/cadastro" element={<Navigate to="/registro" replace />} />
      </Route>

      {/* Rotas do Portal do Aluno */}
      <Route element={<StudentLayout />}>
        <Route path="/home" element={<StudentDashboard />} />
        <Route path="/aluno" element={<Navigate to="/home" replace />} />
        <Route path="/portugues" element={<StudentPortugues />} />
        <Route path="/simulados" element={<StudentSimulados />} />
        <Route path="/aluno/diagnostico" element={<StudentDiagnostico />} />
        <Route path="/redacao" element={<StudentRedacao />} />
        <Route path="/cronograma" element={<StudentCronograma />} />
        <Route path="/materiais" element={<StudentMateriais />} />
        <Route path="/videoaulas" element={<StudentVideoaulas />} />
      </Route>

      {/* Rotas do Portal do Professor (CMS Administrativo Completo) */}
      <Route element={<ProfessorLayout />}>
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/admin" element={<Navigate to="/professor" replace />} />
        <Route path="/professor/alunos" element={<ProfessorAlunos />} />
        <Route path="/professor/aulas" element={<ProfessorAulas />} />
        <Route path="/professor/exercicios" element={<ProfessorExercicios />} />
        <Route path="/professor/simulados" element={<ProfessorSimulados />} />
        <Route path="/professor/diagnostico" element={<ProfessorDiagnostico />} />
        <Route path="/professor/redacoes" element={<ProfessorRedacoes />} />
        <Route path="/professor/materiais" element={<ProfessorMateriais />} />
      </Route>

      {/* Rota 404 */}
      <Route element={<LandingLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
