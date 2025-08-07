import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import {
  Card,
  FormLayout,
  TextField,
  Button,
  Page,
  Layout,
  BlockStack,
  InlineStack,
  Select,
  Text,
  Divider,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "~/shopify.server";
import db from "~/db.server";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const venue = formData.get("venue") as string;
  const address = formData.get("address") as string;
  const date = formData.get("date") as string;
  const time = formData.get("time") as string;

  // Parse ticket categories
  const ticketCategories = [];
  let i = 0;
  while (formData.get(`category_${i}_name`)) {
    ticketCategories.push({
      name: formData.get(`category_${i}_name`) as string,
      description: formData.get(`category_${i}_description`) as string,
      price: parseFloat(formData.get(`category_${i}_price`) as string),
      capacity: parseInt(formData.get(`category_${i}_capacity`) as string),
    });
    i++;
  }

  if (!title || !venue || !date || !time || ticketCategories.length === 0) {
    return json(
      { errors: { general: "Please fill in all required fields" } },
      { status: 400 }
    );
  }

  try {
    const totalCapacity = ticketCategories.reduce((sum, cat) => sum + cat.capacity, 0);

    const event = await db.event.create({
      data: {
        shop: session.shop,
        title,
        description,
        venue,
        address,
        date: new Date(date),
        time,
        totalCapacity,
        status: "PUBLISHED",
        ticketCategories: {
          create: ticketCategories,
        },
      },
    });

    return redirect(`/events/${event.id}`);
  } catch (error) {
    return json(
      { errors: { general: "Failed to create event" } },
      { status: 500 }
    );
  }
};

export default function NewEvent() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [ticketCategories, setTicketCategories] = useState([
    { name: "General Admission", description: "", price: "50", capacity: "100" },
  ]);

  const addTicketCategory = () => {
    setTicketCategories([
      ...ticketCategories,
      { name: "", description: "", price: "", capacity: "" },
    ]);
  };

  const removeTicketCategory = (index: number) => {
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const updateTicketCategory = (index: number, field: string, value: string) => {
    const updated = [...ticketCategories];
    updated[index] = { ...updated[index], [field]: value };
    setTicketCategories(updated);
  };

  return (
    <Page>
      <TitleBar title="Create New Event" />
      <Layout>
        <Layout.Section>
          <Form method="post">
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingLg">Event Details</Text>
                
                <FormLayout>
                  <TextField
                    label="Event Title"
                    name="title"
                    autoComplete="off"
                    helpText="The name of your event"
                  />
                  
                  <TextField
                    label="Description"
                    name="description"
                    multiline={4}
                    autoComplete="off"
                    helpText="Describe your event to potential attendees"
                  />
                  
                  <InlineStack gap="400">
                    <TextField
                      label="Venue Name"
                      name="venue"
                      autoComplete="off"
                    />
                    <TextField
                      label="Address"
                      name="address"
                      autoComplete="off"
                    />
                  </InlineStack>
                  
                  <InlineStack gap="400">
                    <TextField
                      label="Date"
                      name="date"
                      type="date"
                      autoComplete="off"
                    />
                    <TextField
                      label="Time"
                      name="time"
                      type="time"
                      autoComplete="off"
                    />
                  </InlineStack>
                </FormLayout>

                <Divider />

                <Text as="h2" variant="headingLg">Ticket Categories</Text>
                
                {ticketCategories.map((category, index) => (
                  <Card key={index} background="subdued">
                    <BlockStack gap="400">
                      <InlineStack align="space-between">
                        <Text as="h3" variant="headingMd">Category {index + 1}</Text>
                        {ticketCategories.length > 1 && (
                          <Button
                            variant="plain"
                            tone="critical"
                            onClick={() => removeTicketCategory(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </InlineStack>
                      
                      <FormLayout>
                        <input
                          type="hidden"
                          name={`category_${index}_name`}
                          value={category.name}
                        />
                        <input
                          type="hidden"
                          name={`category_${index}_description`}
                          value={category.description}
                        />
                        <input
                          type="hidden"
                          name={`category_${index}_price`}
                          value={category.price}
                        />
                        <input
                          type="hidden"
                          name={`category_${index}_capacity`}
                          value={category.capacity}
                        />
                        
                        <TextField
                          label="Category Name"
                          value={category.name}
                          onChange={(value) => updateTicketCategory(index, "name", value)}
                          autoComplete="off"
                        />
                        
                        <TextField
                          label="Description"
                          value={category.description}
                          onChange={(value) => updateTicketCategory(index, "description", value)}
                          autoComplete="off"
                        />
                        
                        <InlineStack gap="400">
                          <TextField
                            label="Price ($)"
                            value={category.price}
                            onChange={(value) => updateTicketCategory(index, "price", value)}
                            type="number"
                            min="0"
                            step="0.01"
                            autoComplete="off"
                          />
                          <TextField
                            label="Capacity"
                            value={category.capacity}
                            onChange={(value) => updateTicketCategory(index, "capacity", value)}
                            type="number"
                            min="1"
                            autoComplete="off"
                          />
                        </InlineStack>
                      </FormLayout>
                    </BlockStack>
                  </Card>
                ))}
                
                <Button onClick={addTicketCategory} variant="plain">
                  Add Another Ticket Category
                </Button>

                {actionData?.errors?.general && (
                  <Text as="p" tone="critical">
                    {actionData.errors.general}
                  </Text>
                )}

                <InlineStack align="end" gap="200">
                  <Button url="/">Cancel</Button>
                  <Button
                    variant="primary"
                    submit
                    loading={isSubmitting}
                  >
                    Create Event
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}