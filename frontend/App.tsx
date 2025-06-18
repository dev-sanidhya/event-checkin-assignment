import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { apolloClient } from './lib/apollo';
import { useAuthStore } from './store/authStore';
import LoginScreen from './components/LoginScreen';
import EventListScreen from './components/EventListScreen';
import EventDetailScreen from './components/EventDetailScreen';
import { Event } from './types';

const queryClient = new QueryClient();

type Screen = 'login' | 'eventList' | 'eventDetail';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentScreen('eventList');
    } else {
      setCurrentScreen('login');
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCurrentScreen('eventList');
  };

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setCurrentScreen('eventDetail');
  };

  const handleBackToEventList = () => {
    setSelectedEvent(null);
    setCurrentScreen('eventList');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      case 'eventList':
        return <EventListScreen onEventPress={handleEventPress} />;
      case 'eventDetail':
        return selectedEvent ? (
          <EventDetailScreen 
            eventId={selectedEvent.id} 
            onBack={handleBackToEventList} 
          />
        ) : null;
      default:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <SafeAreaProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          {renderCurrentScreen()}
          <StatusBar style="auto" />
        </QueryClientProvider>
      </ApolloProvider>
    </SafeAreaProvider>
  );
}

