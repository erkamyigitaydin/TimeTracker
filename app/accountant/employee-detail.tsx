import { Feather } from '@expo/vector-icons';
import { format } from "date-fns";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useAccountant } from "../../context/AccountantContext";
import { buttonLabels, dateFormats, labels, messages, pdfStatus, symbols } from "../../src/constants/ui";

export default function AccountantEmployeeDetailScreen() {
  const params = useLocalSearchParams();
  const employeeId = params.id as string;
  const router = useRouter();

  const { getEmployeeDetail, currentMonth } = useAccountant();
  const employee = getEmployeeDetail(employeeId);

  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  if (!employee) {
    return (
      <View className="flex-1 bg-white">
        <Text>{messages.employeeNotFound}</Text>
      </View>
    );
  }

  // Group entries by date
  const entriesByDate = employee.entries.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof employee.entries>);

  // Sort dates
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => a.localeCompare(b));

  // Project breakdown
  const projectBreakdown = employee.entries.reduce((acc, entry) => {
    if (!acc[entry.projectId]) acc[entry.projectId] = 0;
    acc[entry.projectId] += entry.hours;
    return acc;
  }, {} as Record<string, number>);

  const projects = Object.entries(projectBreakdown)
    .map(([name, hours]) => ({
      name,
      hours: parseFloat(hours.toFixed(1)),
      percentage: parseFloat(((hours / employee.totalHours) * 100).toFixed(0)),
    }))
    .sort((a, b) => b.hours - a.hours);

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  const handleViewPDF = async () => {
    if (employee.pdfStatus === pdfStatus.missing) {
      Alert.alert(messages.noPdfAlertTitle, messages.noPdfAlertMessage);
      return;
    }

    // Mock PDF viewing
    Alert.alert("PDF Viewer", `Viewing: ${employee.pdfFileName}\nUploaded: ${employee.pdfUploadDate}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Bar */}
      <View className="flex-row justify-between items-center pt-[50px] px-lg pb-[12px] bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-sm">
          <Feather name="arrow-left" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-lg font-semibold text-gray-700">
            <Text className="font-bold">{employee.employeeName}</Text> - {format(currentMonth, dateFormats.monthYear)}
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>

      {/* Summary */}
      <View className="mb-xl">
        <Text className="text-xl font-semibold mb-md">{labels.summary}</Text>
        <View className="bg-white border border-gray-200 rounded-xl p-lg flex-row justify-around">
          <View className="items-center">
            <Text className="text-[28px] font-bold text-gray-700">{employee.totalHours}h</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.totalHours}</Text>
          </View>
          <View className="items-center">
            <Text className="text-[28px] font-bold text-gray-700">{employee.daysLogged}</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.workingDays}</Text>
          </View>
          <View className="items-center">
            <Text className="text-[28px] font-bold text-gray-700">{projects.length}</Text>
            <Text className="text-xs text-gray-500 mt-1">{labels.projects}</Text>
          </View>
        </View>
      </View>

      {/* Project Breakdown */}
      <View className="mb-xl">
        <Text className="text-xl font-semibold mb-md">{labels.projectBreakdown}</Text>
        <View className="bg-white border border-gray-200 rounded-xl p-lg">
          {projects.map((project, index) => (
            <View key={project.name} className={index < projects.length - 1 ? "mb-lg" : ""}>
              <View className="flex-row justify-between mb-1.5">
                <Text className="text-lg font-semibold text-gray-700">{project.name}</Text>
                <Text className="text-lg text-gray-500">{project.hours}h</Text>
              </View>
              <View className="h-1.5 bg-gray-200 rounded-[3px] mb-1 overflow-hidden">
                <View style={{ width: `${project.percentage}%` }} className="h-full bg-primary rounded-[3px]" />
              </View>
              <Text className="text-sm text-gray-500 text-right">{project.percentage}%</Text>
            </View>
          ))}
        </View>
      </View>

      {/* PDF Section */}
      <View className="mb-xl">
        <Text className="text-xl font-semibold mb-md">{labels.timesheetPdf}</Text>
        <View className="bg-white border border-gray-200 rounded-xl p-lg">
          {employee.pdfStatus === pdfStatus.uploaded ? (
            <>
              <View className="mb-md">
                <Text className="text-base font-semibold mb-1">{symbols.pdfEmoji} {employee.pdfFileName}</Text>
                <Text className="text-sm text-gray-500">{labels.uploaded}: {employee.pdfUploadDate}</Text>
              </View>
              <TouchableOpacity onPress={handleViewPDF} className="bg-primary py-md rounded-lg items-center">
                <Text className="text-white font-semibold">{buttonLabels.viewPdf}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className="p-lg items-center">
              <Text className="text-base text-warning font-medium">{symbols.warningEmoji} {labels.noTimesheetUploaded}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Daily Breakdown */}
      <View className="mb-xl">
        <Text className="text-xl font-semibold mb-md">{labels.dailyBreakdown}</Text>
        {sortedDates.map((date) => {
          const dayEntries = entriesByDate[date];
          const dayTotal = dayEntries.reduce((sum, e) => sum + e.hours, 0);
          const isExpanded = expandedDays.has(date);

          return (
            <View key={date} className="bg-white border border-gray-200 rounded-xl mb-sm overflow-hidden">
              <TouchableOpacity onPress={() => toggleDay(date)} className="flex-row justify-between items-center p-md">
                <View className="flex-1">
                  <Text className="text-lg font-medium mb-0.5 text-gray-700">{format(new Date(date), dateFormats.dayMonth)}</Text>
                  <Text className="text-md text-gray-500">{dayTotal.toFixed(1)}h</Text>
                </View>
                <Text className="text-md text-gray-400 ml-md">{isExpanded ? symbols.expandDown : symbols.expandRight}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View className="border-t border-gray-100 p-md pt-sm gap-[10px]">
                  {dayEntries.map((entry) => (
                    <View key={entry.id} className="pl-[10px] border-l-2 border-primary">
                      <View className="flex-row justify-between mb-[3px]">
                        <Text className="text-md font-semibold text-gray-700">{entry.projectId}</Text>
                        <Text className="text-md text-gray-500">{entry.hours}h</Text>
                      </View>
                      {entry.description && (
                        <Text className="text-sm text-gray-500">{entry.description}</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>
      </ScrollView>
    </View>
  );
}
