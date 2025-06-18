import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EVENT, JOIN_EVENT_MUTATION, LEAVE_EVENT_MUTATION } from '../graphql/queries';
import { Event, User } from '../types';
import { useAuthStore } from '../store/authStore';
import { socket, joinEventRoom, leaveEventRoom } from '../lib/socket';

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

export default function EventDetailScreen({ eventId, onBack }: EventDetailScreenProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const user = useAuthStore((state) => state.user);
  
  const { data, loading, error, refetch } = useQuery(GET_EVENT, {
    variables: { id: eventId },
    onCompleted: (data) => {
      if (data?.event) {
        setEvent(data.event);
      }
    },
  });

  const [joinEventMutation, { loading: joiningEvent }] = useMutation(JOIN_EVENT_MUTATION);
  const [leaveEventMutation, { loading: leavingEvent }] = useMutation(LEAVE_EVENT_MUTATION);

  useEffect(() => {
    // Join the socket room for this event
    joinEventRoom(eventId);

    // Listen for real-time updates
    const handleEventUpdate = (updatedEvent: Event) => {
      setEvent(updatedEvent);
    };

    socket.on('event-updated', handleEventUpdate);

    return () => {
      // Clean up
      leaveEventRoom(eventId);
      socket.off('event-updated', handleEventUpdate);
    };
  }, [eventId]);

  const isUserAttending = event?.attendees.some(attendee => attendee.id === user?.id) || false;

  const handleJoinEvent = async () => {
    try {
      const { data } = await joinEventMutation({
        variables: { eventId },
      });
      
      if (data?.joinEvent) {
        setEvent(data.joinEvent);
        Alert.alert('Success', 'You have joined the event!');
      }
    } catch (error) {
      console.error('Join event error:', error);
      Alert.alert('Error', 'Failed to join event. Please try again.');
    }
  };

  const handleLeaveEvent = async () => {
    try {
      const { data } = await leaveEventMutation({
        variables: { eventId },
      });
      
      if (data?.leaveEvent) {
        setEvent(data.leaveEvent);
        Alert.alert('Success', 'You have left the event.');
      }
    } catch (error) {
      console.error('Leave event error:', error);
      Alert.alert('Error', 'Failed to leave event. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading && !event) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading event details...</Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading event details</Text>
        <TouchableOpacity style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{event.name}</Text>
          <Text style={styles.eventLocation}>{event.location}</Text>
          <Text style={styles.eventTime}>{formatDate(event.startTime)}</Text>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isUserAttending ? styles.leaveButton : styles.joinButton,
              (joiningEvent || leavingEvent) && styles.buttonDisabled
            ]}
            onPress={isUserAttending ? handleLeaveEvent : handleJoinEvent}
            disabled={joiningEvent || leavingEvent}
          >
            <Text style={styles.actionButtonText}>
              {joiningEvent || leavingEvent 
                ? 'Processing...' 
                : isUserAttending 
                  ? 'Leave Event' 
                  : 'Join Event'
              }
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attendeesSection}>
          <Text style={styles.sectionTitle}>
            Attendees ({event.attendees.length})
          </Text>
          
          {event.attendees.length === 0 ? (
            <Text style={styles.noAttendeesText}>No attendees yet. Be the first to join!</Text>
          ) : (
            <View style={styles.attendeesList}>
              {event.attendees.map((attendee: User) => (
                <View key={attendee.id} style={styles.attendeeItem}>
                  <View style={styles.attendeeAvatar}>
                    <Text style={styles.attendeeInitials}>
                      {getInitials(attendee.name)}
                    </Text>
                  </View>
                  <View style={styles.attendeeInfo}>
                    <Text style={styles.attendeeName}>{attendee.name}</Text>
                    <Text style={styles.attendeeEmail}>{attendee.email}</Text>
                  </View>
                  {attendee.id === user?.id && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>You</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  eventInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 16,
    color: '#666',
  },
  actionSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#34C759',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  attendeesSection: {
    backgroundColor: 'white',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  noAttendeesText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  attendeesList: {
    gap: 12,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  attendeeAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attendeeInitials: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  attendeeInfo: {
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  attendeeEmail: {
    fontSize: 14,
    color: '#666',
  },
  youBadge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  youBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

