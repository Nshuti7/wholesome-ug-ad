import {
  IconPhoto,
  IconRadio,
  IconUsers,
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
      description: "Total Programs",
      title: quickStats.totalPrograms.toString(),
      icon: <IconRadio />,
      footerText: "Radio programs in the system",
      footerSubText: "Across all categories",
    },
    {
      description: "New Inquiries",
      title: quickStats.newInquiries.toString(),
      icon: <IconCalendarEvent />,
      footerText: "Advertising inquiries",
      footerSubText: `Total inquiries: ${data.overview.totalAdvertisingInquiries}`,
    },
    {
      description: "Team Members",
      title: quickStats.totalTeamMembers.toString(),
      icon: <IconUsers />,
      footerText: "Staff and presenters",
      footerSubText: "Managed in the team section",
    },
    {
      description: "Gallery Items",
      title: data.overview.totalGalleryItems.toString(),
      icon: <IconPhoto />,
      footerText: "Media content available",
      footerSubText: `${data.overview.totalGalleryItems} total items`,
    },
    {
      description: "Partner Logos",
      title: data.overview.totalLogos ? data.overview.totalLogos.toString() : "0",
      icon: <IconPhoto />,
      footerText: "Partner logos",
      footerSubText: data.overview.totalLogos ? `${data.overview.totalLogos} active logos` : "No logos uploaded",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
      {cardData.map((card, index) => (
        <Card 
          key={index} 
          className="bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs"
        >
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
