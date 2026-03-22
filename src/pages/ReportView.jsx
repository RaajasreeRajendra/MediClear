import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Calendar,
  Globe,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import SummaryCard from "../components/results/SummaryCard";
import KeyTermsList from "../components/results/KeyTermsList";
import FindingsList from "../components/results/FindingsList";
import RecommendationsList from "../components/results/RecommendationsList";
import DisclaimerBanner from "../components/results/DisclaimerBanner";

const REPORT_TYPE_LABELS = {
  lab_results: "Lab Results",
  prescription: "Prescription",
  discharge_summary: "Discharge Summary",
  radiology: "Radiology",
  pathology: "Pathology",
  other: "Medical Report",
};

const LANGUAGE_LABELS = {
  en: "English",
  es: "Español",
  hi: "हिन्दी",
  ar: "العربية",
  fr: "Français",
  zh: "中文",
  pt: "Português",
  de: "Deutsch",
};

export default function ReportView() {
  const navigate = useNavigate();

  const reportId = window.location.pathname.split("/report/")[1];

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", reportId],
    queryFn: async () => {
      const storedReports =
        JSON.parse(localStorage.getItem("reports")) || [];

      return storedReports.find(
        (r) => r.id === reportId
      );
    },
    enabled: !!reportId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />

        <h2 className="text-xl font-semibold mb-2">
          Report Not Found
        </h2>

        <p className="text-muted-foreground mb-6">
          This report may have been removed or doesn't exist.
        </p>

        <Button onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                {REPORT_TYPE_LABELS[report.report_type] ||
                  "Report"}
              </Badge>

              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Globe className="w-3 h-3" />
                {LANGUAGE_LABELS[report.language] ||
                  report.language}
              </span>

              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(
                  new Date(report.created_date),
                  "MMM d, yyyy"
                )}
              </span>
            </div>
          </div>

          {report.original_file_url && (
            <a
              href={report.original_file_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Original
              </Button>
            </a>
          )}
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-6"
      >
        <DisclaimerBanner />

        <SummaryCard summary={report.simplified_summary} />

        <FindingsList findings={report.key_findings} />

        <KeyTermsList terms={report.key_terms} />

        <RecommendationsList
          recommendations={report.recommendations}
        />
      </motion.div>
    </div>
  );
}