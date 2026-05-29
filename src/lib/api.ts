import {
  CreateEventRequest,
  EventDetails,
  EventSummary,
  isErrorResponse,
  PublishedEventDetails,
  PublishedEventSummary,
  SpringBootPagination,
  TicketDetails,
  TicketSummary,
  TicketValidationRequest,
  TicketValidationResponse,
  UpdateEventRequest,
} from "@/domain/domain";

async function readOptionalJson(response: Response): Promise<unknown | null> {
  const text = await response.text();
  if (!text) {
    console.error("[api] Empty response body", {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
    });
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("[api] Failed to parse JSON from response", {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      body: text,
      error: (e as Error).message,
    });
    return null;
  }
}
// 1. Add this at the very top of the file (outside the functions)
const BASE_URL = import.meta.env.VITE_API_URL || "";

export const createEvent = async (
  accessToken: string,
  request: CreateEventRequest,
): Promise<void> => {
  // 2. Change the URL to use the BASE_URL
  const response = await fetch(`${BASE_URL}/api/v1/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};


export const listEvents = async (
  accessToken: string,
  page: number,
): Promise<SpringBootPagination<EventSummary>> => {
  const response = await fetch(`${BASE_URL}/api/v1/events?page=${page}&size=2`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as SpringBootPagination<EventSummary>;
};

export const getEvent = async (
  accessToken: string,
  id: string,
): Promise<EventDetails> => {
  const response = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as EventDetails;
};

export const updateEvent = async (
  accessToken: string,
  id: string,
  request: UpdateEventRequest,
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const responseBody = await readOptionalJson(response);
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};
export const deleteEvent = async (
  accessToken: string,
  id: string,
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/api/v1/events/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const responseBody = await readOptionalJson(response);
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const listPublishedEvents = async (
  page: number,
): Promise<SpringBootPagination<PublishedEventSummary>> => {
  const response = await fetch(`${BASE_URL}/api/v1/published-events?page=${page}&size=4`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as SpringBootPagination<PublishedEventSummary>;
};

export const searchPublishedEvents = async (
  query: string,
  page: number,
): Promise<SpringBootPagination<PublishedEventSummary>> => {
  const response = await fetch(
    `${BASE_URL}/api/v1/published-events?q=${query}&page=${page}&size=4`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as SpringBootPagination<PublishedEventSummary>;
};

export const getPublishedEvent = async (
  id: string,
): Promise<PublishedEventDetails> => {
  const response = await fetch(`${BASE_URL}/api/v1/published-events/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as PublishedEventDetails;
};

export const purchaseTicket = async (
  accessToken: string,
  eventId: string,
  ticketTypeId: string,
): Promise<void> => {
  // In dev mode we use session cookies for authentication (dev access tokens are prefixed with "dev-")
  const isDevToken = typeof accessToken === "string" && accessToken.startsWith("dev-");

  // When using the dev token, call backend directly so the browser will include the session cookie
  const apiBase = isDevToken ? "http://localhost:8080" : BASE_URL || "";

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (isDevToken) {
    (options as any).credentials = "include";
  } else if (accessToken) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const response = await fetch(
    `${apiBase}/api/v1/events/${eventId}/ticket-types/${ticketTypeId}/tickets`,
    options,
  );

  if (!response.ok) {
    const responseBody = await readOptionalJson(response);
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
};

export const listTickets = async (
  accessToken: string,
  page: number,
): Promise<SpringBootPagination<TicketSummary>> => {
  const response = await fetch(`${BASE_URL}/api/v1/tickets?page=${page}&size=8`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as SpringBootPagination<TicketSummary>;
};

export const getTicket = async (
  accessToken: string,
  id: string,
): Promise<TicketDetails> => {
  const response = await fetch(`${BASE_URL}/api/v1/tickets/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as TicketDetails;
};

export const getTicketQr = async (
  accessToken: string,
  id: string,
): Promise<Blob> => {
  const response = await fetch(`${BASE_URL}/api/v1/tickets/${id}/qr-codes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error("Unable to get ticket QR code");
  }
};

export const validateTicket = async (
  accessToken: string,
  request: TicketValidationRequest,
): Promise<TicketValidationResponse> => {
  // Support dev session-based auth: when access tokens are prefixed with "dev-",
  // call backend directly and send cookies so Spring Session can authenticate.
  const isDevToken = typeof accessToken === "string" && accessToken.startsWith("dev-");
  const apiBase = isDevToken ? "http://localhost:8080" : BASE_URL || "";

  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  };

  if (isDevToken) {
    (options as any).credentials = "include";
  } else if (accessToken) {
    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    };
  }

  const response = await fetch(`${apiBase}/api/v1/ticket-validations`, options);

  const responseBody = await readOptionalJson(response);

  if (!response.ok) {
    if (responseBody && isErrorResponse(responseBody)) {
      throw new Error(responseBody.error);
    } else {
      console.error(JSON.stringify(responseBody));
      throw new Error("An unknown error occurred");
    }
  }
  
  if (responseBody == null) {
    throw new Error("Empty response body from server");
  }

  return responseBody as TicketValidationResponse;
};
