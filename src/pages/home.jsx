import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Languages, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import FileUploader from "../components/upload/FileUploader";
import TextInput from "../components/upload/TextInput";
import LanguageSelector from "../components/upload/LanguageSelector";
import ProcessingState from "../components/upload/ProcessingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const [language, setLanguage] = useState("en");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadMode, setUploadMode] = useState("file");

  const canSubmit =
    (uploadMode === "file" && file) ||
    (uploadMode === "text" && pastedText.trim());

  const handleAnalyze = async () => {
    setIsProcessing(true);

    // Simulated processing animation
    setTimeout(() => setProcessingStep(1), 800);
    setTimeout(() => setProcessingStep(2), 1600);

    setTimeout(() => {
      const reportId = Date.now().toString();

      const newReport = {
        id: reportId,
        title: "Medical Report Analysis",
        report_type: "lab_results",
        language,
        created_date: new Date().toISOString(),

        simplified_summary:
          "This is a demo simplified explanation of your medical report. In production this would be generated using AI.",

        key_terms: [
          {
            term: "Hemoglobin",
            original_context: "Hb 12.1 g/dL",
            simple_explanation:
              "Hemoglobin carries oxygen in your blood. Your level is within normal range.",
            severity: "normal",
          },
        ],

        key_findings: [
          {
            finding: "Blood count normal",
            explanation:
              "Your blood count levels appear healthy based on the report.",
            status: "normal",
          },
        ],

        recommendations: [
          "Maintain a balanced diet",
          "Stay hydrated",
          "Consult doctor if symptoms persist",
        ],
      };

      const existingReports =
        JSON.parse(localStorage.getItem("reports")) || [];

      existingReports.unshift(newReport);

      localStorage.setItem(
        "reports",
        JSON.stringify(existingReports)
      );

      setIsProcessing(false);

      navigate(`/report/${reportId}`);
    }, 2400);
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <ProcessingState step={processingStep} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <section className="py-12 sm:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Heart className="w-3.5 h-3.5" />
            AI-Powered Medical Report Simplifier
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
            Understand Your
            <br />
            <span className="text-primary">Medical Reports</span>
          </h1>

          <p className="text-muted-foreground max-w-lg mx-auto mb-10">
            Upload your lab results, prescriptions, or discharge summaries and
            get clear explanations instantly.
          </p>
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {[
            {
              icon: Zap,
              title: "Instant Analysis",
              desc: "Get results in seconds",
            },
            {
              icon: Languages,
              title: "8+ Languages",
              desc: "Multilingual support",
            },
            {
              icon: ShieldCheck,
              title: "Private & Secure",
              desc: "Your data stays safe",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-4 rounded-xl bg-card border"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <f.icon className="w-5 h-5 text-primary" />
              </div>

              <span className="text-sm font-medium">
                {f.title}
              </span>

              <span className="text-xs text-muted-foreground">
                {f.desc}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      <motion.section className="max-w-xl mx-auto pb-20">
        <Card>
          <CardContent className="p-6 space-y-5">
            <Tabs
              value={uploadMode}
              onValueChange={setUploadMode}
            >
              <TabsList className="w-full">
                <TabsTrigger value="file" className="flex-1">
                  Upload File
                </TabsTrigger>

                <TabsTrigger value="text" className="flex-1">
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file">
                <FileUploader
                  file={file}
                  onFileSelect={setFile}
                  onRemove={() => setFile(null)}
                />
              </TabsContent>

              <TabsContent value="text">
                <TextInput
                  value={pastedText}
                  onChange={setPastedText}
                />
              </TabsContent>
            </Tabs>

            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!canSubmit}
              className="w-full h-12"
            >
              Analyze Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}