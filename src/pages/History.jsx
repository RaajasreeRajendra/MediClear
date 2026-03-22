import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, ArrowRight, Inbox, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const REPORT_TYPE_LABELS = {
  lab_results: "Lab Results",
  prescription: "Prescription",
  discharge_summary: "Discharge Summary",
  radiology: "Radiology",
  pathology: "Pathology",
  other: "Report",
};

const LANGUAGE_LABELS = {
  en: "🇬🇧",
  es: "🇪🇸",
  hi: "🇮🇳",
  ar: "🇸🇦",
  fr: "🇫🇷",
  zh: "🇨🇳",
  pt: "🇧🇷",
  de: "🇩🇪",
};

export default function History() {
  const queryClient = useQueryClient();

  // Replace Base44 API with localStorage mock (demo-safe)
  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const stored = localStorage.getItem("reports");
      return stored ? JSON.parse(stored) : [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const stored = JSON.parse(localStorage.getItem("reports") || "[]");
      const updated = stored.filter((r) => r.id !== id);
      localStorage.setItem("reports", JSON.stringify(updated));
      return true;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reports"] }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Report History
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your previously analyzed medical reports
        </p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-medium text-foreground mb-2">
            No reports yet
          </h3>

          <p className="text-sm text-muted-foreground mb-6">
            Upload your first medical report to get started.
          </p>

          <Link to="/">
            <Button>
              Analyze a Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <Link
                      to={`/report/${report.id}`}
                      className="font-medium text-sm hover:text-primary"
                    >
                      {report.title}
                    </Link>

                    <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary">
                        {REPORT_TYPE_LABELS[
                          report.report_type
                        ] || "Report"}
                      </Badge>

                      <span>
                        {LANGUAGE_LABELS[report.language]}
                      </span>

                      <span>
                        {format(
                          new Date(report.created_date),
                          "MMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      deleteMutation.mutate(report.id)
                    }
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}