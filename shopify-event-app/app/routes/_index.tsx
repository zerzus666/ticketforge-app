import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  DataTable,
  Thumbnail,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const events = await db.event.findMany({
    where: { shop: session.shop },
    include: {
      ticketCategories: true,
      _count: {
        select: { orders: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate stats
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === "PUBLISHED").length;
  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + event.soldTickets, 0);

  // Get events with low stock or sold out
  const alertEvents = events.filter(event => {
    const totalCapacity = event.totalCapacity;
    const available = totalCapacity - event.soldTickets;
    const percentageAvailable = totalCapacity > 0 ? (available / totalCapacity) * 100 : 0;
    return available === 0 || percentageAvailable <= 15;
  });

  return json({
    events,
    stats: {
      totalEvents,
      activeEvents,
      totalRevenue,
      totalTicketsSold,
    },
    alertEvents,
  });
};

export default function Index() {
  const { events, stats, alertEvents } = useLoaderData<typeof loader>();

  const getAvailabilityStatus = (event: any) => {
    const available = event.totalCapacity - event.soldTickets;
    const percentage = event.totalCapacity > 0 ? (available / event.totalCapacity) * 100 : 0;
    
    if (available === 0) return { status: "SOLD OUT", tone: "critical" as const };
    if (percentage <= 5) return { status: "CRITICAL", tone: "critical" as const };
    if (percentage <= 15) return { status: "LOW STOCK", tone: "warning" as const };
    return { status: "Available", tone: "success" as const };
  };

  const eventRows = events.map((event) => {
    const availability = getAvailabilityStatus(event);
    return [
      event.title,
      event.venue,
      new Date(event.date).toLocaleDateString(),
      `${event.soldTickets}/${event.totalCapacity}`,
      <Badge key={event.id} tone={availability.tone}>
        {availability.status}
      </Badge>,
      `$${event.revenue.toFixed(2)}`,
    ];
  });

  return (
    <Page>
      <TitleBar title="Event Ticketing Dashboard" />
      <Layout>
        {/* Stats Overview */}
        <Layout.Section>
          <InlineStack gap="400">
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Total Events</Text>
                <Text as="p" variant="displayLarge">{stats.totalEvents}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Active Events</Text>
                <Text as="p" variant="displayLarge">{stats.activeEvents}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Tickets Sold</Text>
                <Text as="p" variant="displayLarge">{stats.totalTicketsSold}</Text>
              </BlockStack>
            </Card>
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">Total Revenue</Text>
                <Text as="p" variant="displayLarge">${stats.totalRevenue.toFixed(2)}</Text>
              </BlockStack>
            </Card>
          </InlineStack>
        </Layout.Section>

        {/* Inventory Alerts */}
        {alertEvents.length > 0 && (
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">🚨 Inventory Alerts</Text>
                {alertEvents.map((event) => {
                  const availability = getAvailabilityStatus(event);
                  const available = event.totalCapacity - event.soldTickets;
                  
                  return (
                    <Card key={event.id} background={availability.tone === "critical" ? "critical" : "warning"}>
                      <BlockStack gap="200">
                        <InlineStack align="space-between">
                          <Text as="h3" variant="headingMd">{event.title}</Text>
                          <Badge tone={availability.tone}>{availability.status}</Badge>
                        </InlineStack>
                        <Text as="p">
                          {available === 0 
                            ? `All ${event.totalCapacity} tickets have been sold!`
                            : `Only ${available} tickets remaining out of ${event.totalCapacity}`
                          }
                        </Text>
                        <Text as="p" tone="subdued">{event.venue} • {new Date(event.date).toLocaleDateString()}</Text>
                      </BlockStack>
                    </Card>
                  );
                })}
              </BlockStack>
            </Card>
          </Layout.Section>
        )}

        {/* Events Table */}
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text as="h2" variant="headingLg">Your Events</Text>
                <Button variant="primary" url="/events/new">
                  Create Event
                </Button>
              </InlineStack>
              
              {events.length === 0 ? (
                <EmptyState
                  heading="Create your first event"
                  action={{
                    content: "Create Event",
                    url: "/events/new",
                  }}
                  image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                >
                  <p>Start selling tickets by creating your first event.</p>
                </EmptyState>
              ) : (
                <DataTable
                  columnContentTypes={[
                    'text',
                    'text', 
                    'text',
                    'text',
                    'text',
                    'numeric',
                  ]}
                  headings={[
                    'Event Name',
                    'Venue', 
                    'Date',
                    'Tickets Sold',
                    'Status',
                    'Revenue',
                  ]}
                  rows={eventRows}
                />
              )}
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}