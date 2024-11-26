export class ResponseSupportTicketDto {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
}

export class ResponseSupportTicketByManagerDto {
  id: string;
  createdAt: string;
  isActive: boolean;
  hasNewMessages: boolean;
  client: {
    id: string;
    name: string;
    email: string;
    contactPhone: string;
  };
}
