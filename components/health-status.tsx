"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Database, Server, Activity, Cpu, HardDrive, Network, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  uptime: number;
  services: {
    redis: {
      status: "healthy" | "degraded" | "unhealthy";
      connected: boolean;
      connectionRetries: number;
      fallbackStorageSize: number;
      usingFallback: boolean;
    };
    mongodb: {
      status: "healthy" | "degraded" | "unhealthy";
      state: string;
      connected: boolean;
    };
    memory: {
      status: "healthy" | "degraded" | "unhealthy";
      rss: string;
      heapUsed: string;
      heapTotal: string;
    };
  };
}

export function HealthStatus() {
  const [healthData, setHealthData] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/health');
      if (response.ok) {
        const data = await response.json();
        setHealthData(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch health status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500 text-white';
      case 'degraded':
        return 'bg-yellow-500 text-white';
      case 'unhealthy':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case 'degraded':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'unhealthy':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const parseMemoryString = (memoryStr: string) => {
    const match = memoryStr.match(/(\d+(?:\.\d+)?)\s*MB/);
    return match ? parseFloat(match[1]) : 0;
  };

  const calculateMemoryUsage = () => {
    if (!healthData) return { used: 0, total: 0, percentage: 0 };
    
    const used = parseMemoryString(healthData.services.memory.heapUsed);
    const total = parseMemoryString(healthData.services.memory.heapTotal);
    const percentage = total > 0 ? (used / total) * 100 : 0;
    
    return { used, total, percentage };
  };

  if (!healthData) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">System Health & Performance</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealthStatus}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p>Loading system health status...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const memoryUsage = calculateMemoryUsage();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg font-semibold">System Health & Performance</CardTitle>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs font-medium",
              getStatusColor(healthData.status)
            )}
          >
            {getStatusIcon(healthData.status)}
            <span className="ml-2 capitalize">{healthData.status}</span>
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Last updated: {lastUpdated?.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHealthStatus}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Redis Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Redis</p>
                <p className="text-xs text-muted-foreground">
                  {healthData.services.redis.usingFallback ? 'Using Fallback' : 'Connected'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(healthData.services.redis.status)}
              {healthData.services.redis.usingFallback && (
                <Badge variant="outline" className="text-xs">
                  Fallback
                </Badge>
              )}
            </div>
          </div>

          {/* MongoDB Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <Server className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">MongoDB</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {healthData.services.mongodb.state}
                </p>
              </div>
            </div>
            {getStatusIcon(healthData.services.mongodb.status)}
          </div>

          {/* Memory Status */}
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Memory</p>
                <p className="text-xs text-muted-foreground">
                  {healthData.services.memory.heapUsed}
                </p>
              </div>
            </div>
            {getStatusIcon(healthData.services.memory.status)}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Memory Usage */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <HardDrive className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Used: {healthData.services.memory.heapUsed}</span>
                <span>Total: {healthData.services.memory.heapTotal}</span>
              </div>
              <Progress value={memoryUsage.percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {memoryUsage.percentage.toFixed(1)}% used
              </p>
            </div>
          </div>

          {/* Uptime */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Server Uptime</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatUptime(healthData.uptime)}
              </p>
              <p className="text-xs text-muted-foreground">Running time</p>
            </div>
          </div>

          {/* Redis Fallback Status */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Redis Fallback</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {healthData.services.redis.fallbackStorageSize}
              </p>
              <p className="text-xs text-muted-foreground">
                {healthData.services.redis.usingFallback ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="p-4 rounded-lg border bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Network className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Connections</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {healthData.services.redis.connectionRetries}
              </p>
              <p className="text-xs text-muted-foreground">Retry attempts</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Last Health Check:</span>
              <span className="font-mono">{healthData.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span>Auto-refresh:</span>
              <span>Every 30 seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="capitalize">{process.env.NODE_ENV || 'development'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
