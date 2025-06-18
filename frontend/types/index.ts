export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  id: string;
  name: string;
  location: string;
  startTime: string;
  attendees: User[];
}

