export type RealtimeEvent =
  | { type: "message:new"; channelId: string; message: { id: string; senderId: string; content: string; createdAt: string } }
  | { type: "presence:update"; employeeId: string; status: "online" | "away" | "offline" }
  | { type: "typing:start"; channelId: string; employeeId: string }
  | { type: "typing:stop"; channelId: string; employeeId: string };

export function createRealtimeMessage(event: RealtimeEvent): string {
  return JSON.stringify(event);
}

export function parseRealtimeMessage(data: string): RealtimeEvent | null {
  try {
    return JSON.parse(data) as RealtimeEvent;
  } catch {
    return null;
  }
}
