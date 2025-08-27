# YaYa Wallet Transaction Dashboard

A full-stack React.js application that provides a comprehensive dashboard for monitoring YaYa Wallet transactions with search, pagination, and responsive design.

## Features

- **Transaction Listing**: Display all transactions in a tabular format with proper pagination
- **Search Functionality**: Search by sender account name, receiver account name, cause, or transaction ID
- **Visual Transaction Types**: Clear visual indicators for incoming (green) and outgoing (red) transactions
- **Responsive Design**: Adapts to different screen sizes with horizontal scrolling on mobile
- **Security**: API credentials are handled securely using environment variables
- **Real-time Data**: Fetches live data from YaYa Wallet sandbox API

## Transaction Fields Displayed

- Transaction ID
- Sender
- Receiver  
- Amount (with currency formatting)
- Currency
- Cause
- Created At (formatted date/time)
- Transaction Type (incoming/outgoing with visual indicators)

## Transaction Type Logic

- **Incoming**: When the receiver is the current user OR when sender and receiver are the same (top-up transactions)
- **Outgoing**: When the sender is the current user and receiver is different

## Technology Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **TypeScript**: Full type safety
- **Icons**: Lucide React
- **API**: YaYa Wallet REST API

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

\`\`\`env
# YaYa Wallet API Credentials
YAYA_API_SECRET=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcGlfa2V5Ijoia2V5LXRlc3RfMTM4MTdlODctMzNhOS00NzU2LTgyZTAtZTZhYzc0YmU1Zjc3Iiwic2VjcmV0IjoiY2E5ZjJhMGM5ZGI1ZmRjZWUxMTlhNjNiMzNkMzVlMWQ4YTVkNGZiYyJ9.HesEEFWkY55B8JhxSJT4VPJTXZ-4a18wWDRacTcimNw
NEXT_PUBLIC_YAYA_API_KEY=key-test_13817e87-33a9-4756-82e0-e6ac74be5f77
\`\`\`

### 2. Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

### 3. Access the Application

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## API Integration

The application integrates with two YaYa Wallet API endpoints:

### 1. Get Transactions by User
- **Endpoint**: `GET https://sandbox.yayawallet.com/api/en/transaction/find-by-user`
- **Usage**: Fetches all transactions for the authenticated user
- **Pagination**: Uses `p` query parameter for page numbers

### 2. Search Transactions
- **Endpoint**: `POST https://sandbox.yayawallet.com/api/en/transaction/search`
- **Usage**: Searches transactions based on query string
- **Body**: `{"query": "search_term"}`
- **Pagination**: Uses `p` query parameter for page numbers

## Security Considerations

1. **API Secret Protection**: The API secret is stored as a server-side environment variable (`YAYA_API_SECRET`) and never exposed to the client
2. **API Key**: The API key is prefixed with `NEXT_PUBLIC_` as it's safe to expose on the client side for authentication headers
3. **Environment Variables**: All sensitive credentials are stored in environment variables, not hardcoded
4. **HTTPS**: All API calls are made over HTTPS to the sandbox environment

## Testing the Solution

### Manual Testing Steps

1. **Basic Functionality**:
   - Load the dashboard and verify transactions are displayed
   - Check that pagination works correctly
   - Verify search functionality with different query types

2. **Search Testing**:
   - Search by transaction ID
   - Search by sender name
   - Search by receiver name  
   - Search by cause/description
   - Test empty search results

3. **Visual Indicators**:
   - Verify incoming transactions show green color and down-left arrow
   - Verify outgoing transactions show red color and up-right arrow
   - Check that top-up transactions (same sender/receiver) are marked as incoming

4. **Responsive Design**:
   - Test on mobile devices (table should scroll horizontally)
   - Test on tablet and desktop sizes
   - Verify all elements are accessible and readable

5. **Error Handling**:
   - Test with invalid API credentials
   - Test network failure scenarios
   - Verify appropriate error messages are displayed

### Automated Testing

\`\`\`bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production (tests compilation)
npm run build
\`\`\`

## Problem-Solving Approach

### 1. Architecture Decisions
- **Component-based**: Single `TransactionDashboard` component with clear separation of concerns
- **State Management**: Used React hooks for local state management (transactions, pagination, search)
- **API Integration**: Implemented both GET and POST endpoints based on search requirements
- **Type Safety**: Full TypeScript implementation with proper interfaces

### 2. Security Implementation
- Environment variables for API credentials
- Server-side API secret handling
- Client-side API key for headers (safe to expose)
- HTTPS-only API communication

### 3. User Experience
- Loading states during API calls
- Error handling with user-friendly messages
- Clear visual indicators for transaction types
- Responsive design for all screen sizes
- Intuitive search and pagination controls

### 4. Performance Considerations
- Efficient re-rendering with proper dependency arrays
- Pagination to limit data transfer
- Debounced search (could be added for production)
- Optimized table rendering

## Assumptions Made

1. **Current User**: Since user management is not required, I used a placeholder `CURRENT_USER` constant to determine transaction direction
2. **Currency Formatting**: Used standard Intl.NumberFormat with ETB as default currency
3. **Date Formatting**: Used locale-specific date/time formatting
4. **API Response Structure**: Assumed standard pagination response with `data`, `total`, `page`, `per_page`, and `total_pages` fields
5. **Error Handling**: Implemented basic error handling for network and API errors

## Production Considerations

For a production deployment, consider:

1. **Authentication**: Implement proper user authentication and session management
2. **Rate Limiting**: Add client-side rate limiting for API calls
3. **Caching**: Implement caching strategy for frequently accessed data
4. **Monitoring**: Add error tracking and performance monitoring
5. **Testing**: Add comprehensive unit and integration tests
6. **Security**: Implement additional security headers and CSRF protection
