/**
 * Example: Using Agent-Skill Context Enrichment
 * 
 * This example demonstrates how to use the new execute-with-context endpoint
 * to enable agents to automatically fetch and use skill data in their responses.
 * 
 * Scenario: Airline Flight Assistant
 * - Agent needs customer profile info from Salesforce CRM
 * - Agent needs to see customer's booked flights
 * - User asks a question like "Show me my profile and flights"
 * - Agent automatically calls both skills and provides enriched response
 */

// ============================================================================
// BACKEND SETUP (NestJS)
// ============================================================================

// 1. Create skills in your database:
const salesforceProfileSkill = {
  name: 'GetCustomerProfile',
  type: 'api_call',
  description: 'Fetch customer profile information from Salesforce',
  config: {
    url: 'https://your-salesforce.api/v1/customers/{email}',
    method: 'GET',
    authType: 'bearer',
    authConfig: { token: process.env.SALESFORCE_TOKEN },
  },
  inputSchema: {
    properties: {
      email: { type: 'string', description: 'Customer email' },
    },
    required: ['email'],
  },
  outputSchema: {
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
      phoneNumber: { type: 'string' },
      membershipTier: { type: 'string' },
    },
  },
};

const flightsSkill = {
  name: 'GetBookedFlights',
  type: 'api_call',
  description: 'Fetch booked flights for a customer',
  config: {
    url: 'https://your-airline.api/v1/customers/{customerId}/flights',
    method: 'GET',
    authType: 'api_key',
    authConfig: { key: process.env.AIRLINE_API_KEY, headerName: 'X-API-Key' },
  },
  inputSchema: {
    properties: {
      customerId: { type: 'string', description: 'Salesforce Customer ID' },
    },
    required: ['customerId'],
  },
  outputSchema: {
    properties: {
      flights: {
        type: 'array',
        items: {
          properties: {
            flightNumber: { type: 'string' },
            departure: { type: 'string' },
            arrival: { type: 'string' },
            departureTime: { type: 'string' },
            status: { type: 'string' },
          },
        },
      },
    },
  },
};

// 2. Create an agent with these skills assigned:
const airlineAssistant = {
  name: 'Airline Flight Assistant',
  description: 'Helps customers with flight information and bookings',
  promptTemplate: `You are a helpful airline customer service assistant. 
You have access to customer profile information and their booked flights.
Always be friendly and professional.
If information is available, provide it. If not, explain what additional information you would need.`,
  modelId: 'gpt-4-model-id',
  temperature: 0.7,
  skillIds: ['salesforce-profile-skill-id', 'flights-skill-id'],
};

// ============================================================================
// API USAGE
// ============================================================================

// Make request to the new endpoint:
// POST /agents/{agentId}/execute-with-context
// Authorization: Bearer {jwt-token}

const requestBody = {
  userMessage: 'Hi, I\'m john@example.com. Can you show me my profile and upcoming flights?',
};

const response = await fetch('http://localhost:3000/agents/agent-123/execute-with-context', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-jwt-token',
  },
  body: JSON.stringify(requestBody),
});

const result = await response.json();

// Response structure:
// {
//   "data": {
//     "response": "Hello John! Based on your profile from our system, I can see...",
//     "skillsUsed": ["GetCustomerProfile", "GetBookedFlights"],
//     "skillDetails": [
//       {
//         "skillName": "GetCustomerProfile",
//         "output": {
//           "id": "CUST123",
//           "name": "John Doe",
//           "email": "john@example.com",
//           "phoneNumber": "+1-555-0123",
//           "membershipTier": "Gold"
//         }
//       },
//       {
//         "skillName": "GetBookedFlights",
//         "output": {
//           "flights": [
//             {
//               "flightNumber": "AA-123",
//               "departure": "New York (JFK)",
//               "arrival": "Los Angeles (LAX)",
//               "departureTime": "2024-05-15 10:30 AM",
//               "status": "Confirmed"
//             }
//           ]
//         }
//       }
//     ]
//   }
// }

// ============================================================================
// FRONTEND USAGE (React)
// ============================================================================

import { agentExecutionApi } from '@/api/agent-execution';

const TryAgentExample = () => {
  const [selectedAgentId] = useState('agent-123');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState<string>('');
  const [skillsUsed, setSkillsUsed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleExecuteWithContext = async () => {
    setLoading(true);
    try {
      const result = await agentExecutionApi.executeWithContextEnrichment(
        selectedAgentId,
        userMessage,
      );

      setResponse(result.response);
      setSkillsUsed(result.skillsUsed);
      console.log('Skills executed:', result.skillDetails);
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Ask the agent something..."
      />
      <button onClick={handleExecuteWithContext} disabled={loading}>
        {loading ? 'Executing with context...' : 'Execute with Context'}
      </button>

      {response && (
        <div>
          <h3>Agent Response:</h3>
          <p>{response}</p>

          {skillsUsed.length > 0 && (
            <div>
              <h4>Skills Used:</h4>
              <ul>
                {skillsUsed.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// HOW THE CONTEXT ENRICHMENT WORKS
// ============================================================================

/*
STEP 1: Keyword Matching
- User message: "Hi, I'm john@example.com. Can you show me my profile and upcoming flights?"
- Keywords in message: ["profile", "flights"]
- Agents skills: ["GetCustomerProfile", "GetBookedFlights"]
- Match: GetCustomerProfile (contains "profile"), GetBookedFlights (contains "flight")

STEP 2: Parameter Extraction
- GetCustomerProfile expects: { email: string }
- Extracted from message: email = "john@example.com"
- GetBookedFlights expects: { customerId: string }
- Will be filled from GetCustomerProfile output: customerId = "CUST123"

STEP 3: Skill Execution
- Execute GetCustomerProfile with { email: "john@example.com" }
- Receive: { id: "CUST123", name: "John Doe", ... }
- Execute GetBookedFlights with { customerId: "CUST123" }
- Receive: { flights: [...] }

STEP 4: Prompt Enrichment
- Original prompt: "You are a helpful airline customer service assistant..."
- Enriched prompt adds:
  ## Available Information:
  
  ### GetCustomerProfile:
  {
    "id": "CUST123",
    "name": "John Doe",
    ...
  }
  
  ### GetBookedFlights:
  {
    "flights": [...]
  }
  
  User Query: Hi, I'm john@example.com...

STEP 5: LLM Response
- LLM sees all the context and skill data
- Generates natural, informative response
- Returns response with metadata about skills used
*/

// ============================================================================
// ERROR HANDLING
// ============================================================================

/*
If a skill fails:
- Error is captured: { skillName: "GetBookedFlights", output: {}, error: "API timeout" }
- Execution continues with other skills
- LLM still gets partial context and handles the failure gracefully
- Response includes error information in skillDetails

Example error response:
{
  "response": "I was able to retrieve your profile: John Doe... However, I had trouble fetching your flight information at this moment. Could you please try again?",
  "skillsUsed": ["GetCustomerProfile", "GetBookedFlights"],
  "skillDetails": [
    {
      "skillName": "GetCustomerProfile",
      "output": { "id": "CUST123", ... }
    },
    {
      "skillName": "GetBookedFlights",
      "error": "API timeout after 30 seconds"
    }
  ]
}
*/
