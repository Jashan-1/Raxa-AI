import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme, Container } from './styles/GlobalStyles';
import { VoiceCloneSection } from './components/VoiceCloneSection';
import { ScriptGenerationSection } from './components/ScriptGenerationSection';
import { AudioGenerationSection } from './components/AudioGenerationSection';
import { CompleteWorkflowSection } from './components/CompleteWorkflowSection';
import { Mic2, Sparkles } from 'lucide-react';

const AppContainer = styled.div`
  min-height: 100vh;
  padding: ${theme.spacing.lg} 0;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const LogoIcon = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.sm};
  color: ${theme.colors.white};
`;

const AppTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #764ba2;
  margin: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 2rem;
  }
`;

const AppSubtitle = styled.p`
  font-size: 1.25rem;
  color: ${theme.colors.gray[100]};
  margin: ${theme.spacing.sm} 0 0 0;
  font-weight: 300;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.125rem;
  }
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const SectionDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${theme.spacing.lg} 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, ${theme.colors.gray[300]} 50%, transparent 100%);
`;

const DividerIcon = styled.div`
  background: ${theme.colors.white};
  border-radius: 50%;
  padding: ${theme.spacing.sm};
  margin: 0 ${theme.spacing.md};
  color: ${theme.colors.primary[500]};
`;

const HomePage: React.FC = () => {
  return (
    <AppContainer>
      <Container>
        <Header>
          <Logo>
            <LogoIcon>
              <Mic2 size={32} />
            </LogoIcon>
          </Logo>
          <AppTitle>Raxa-AI Podcast Maker</AppTitle>
          <AppSubtitle>
            Create professional podcasts with AI-powered voice cloning and script generation
          </AppSubtitle>
        </Header>

        <Main>
          <VoiceCloneSection />
          
          <SectionDivider>
            <DividerLine />
            <DividerIcon>
              <Sparkles size={20} />
            </DividerIcon>
            <DividerLine />
          </SectionDivider>

          <ScriptGenerationSection />
          
          <SectionDivider>
            <DividerLine />
            <DividerIcon>
              <Sparkles size={20} />
            </DividerIcon>
            <DividerLine />
          </SectionDivider>

          <AudioGenerationSection />
          
          <SectionDivider>
            <DividerLine />
            <DividerIcon>
              <Sparkles size={20} />
            </DividerIcon>
            <DividerLine />
          </SectionDivider>

          <CompleteWorkflowSection />
        </Main>
      </Container>
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;