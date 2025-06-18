import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../graphql/queries';
import { Event } from '../types';

interface EventListScreenProps {
  onEventPress: (event: Event) => void;
}

export default function EventListScreen({ onEventPress }: EventListScreenProps) {
  const { data, loading, error, refetch } = useQuery(GET_EVENTS, {
    pollInterval: 5000, // Poll every 5 seconds for updates
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => onEventPress(item)}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventName}>{item.name}</Text>
        <View style={styles.attendeesBadge}>
          <Text style={styles.attendeesCount}>{item.attendees.length}</Text>
        </View>
      </View>
      <Text style={styles.eventLocation}>{item.location}</Text>
      <Text style={styles.eventTime}>{formatDate(item.startTime)}</Text>
      <Text style={styles.attendeesText}>
        {item.attendees.length} {item.attendees.length === 1 ? 'attendee' : 'attendees'}
      </Text>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading events</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Events</Text>
      <FlatList
        data={data?.events || []}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  attendeesBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  attendeesCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  attendeesText: {
    fontSize: 12,
    color: '#999',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

