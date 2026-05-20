import {
  IconPhoto,
  IconClockHour4,
  IconUsers,
  IconStar,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard/types";

interface Props {
  data: DashboardData;
}

export function SectionCards({ data }: Props) {
  const { quickStats, summaryCards } = data;

  const cardData = [
    {
      description: "Pending Reviews",
      title: quickStats.pendingReviews.toString(),
      icon: <IconClockHour4 />,
      footerText: "Reviews awaiting approval",
      footerSubText: "Across all categories",
    },
    {
      description: "New Contacts",
      title: summaryCards.recentContacts.toString(),
      icon: <IconUsers />,
      footerText: "New messages in last 30 days",
      footerSubText: `Total contacts: ${data.overview.totalContacts}`,
    },
    {
      description: "Pending Bookings",
      title: quickStats.pendingBookings.toString(),
      icon: <IconCalendarEvent />,
      footerText: "Bookings awaiting confirmation",
      footerSubText: `Total bookings: ${data.overview.totalBookings}`,
    },
    {
      description: "Gallery Images",
      title: quickStats.totalImages.toString(),
      icon: <IconPhoto />,
      footerText: "Total images in the gallery",
      footerSubText: "Managed in the gallery section",
    },
    {
      description: "Average Rating",
      title: quickStats.averageRating.toFixed(1),
      icon: <IconStar />,
      footerText: "Company-wide average rating",
      footerSubText: `${data.reviews.overall.totalReviews} total reviews`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
      {cardData.map((card, index) => (
        <Card key={index} className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>{card.description}</CardDescription>
              <Badge variant="outline" className="p-2">
                {card.icon}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-semibold tabular-nums">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="font-medium">{card.footerText}</div>
            <div className="text-muted-foreground">{card.footerSubText}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
