import { Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEmployee } from "../../context/EmployeeContext";
import { routes } from "../../src/constants/ui";
import { colors, fontSizes, fontWeights, iconSizes, layout, spacing } from "../theme";

// Project type definition
interface Project {
  id: string;
  name: string;
  description: string;
  assignedMembers: string[];
}

// This will be populated with actual data later
const getAllProjects = (): Project[] => {
  return [];
};

// Get projects assigned to the logged-in employee
const getMyProjects = (employeeId: string): Project[] => {
  const allProjects = getAllProjects();
  return allProjects.filter(project => 
    project.assignedMembers.includes(employeeId)
  );
};

export default function EmployeeMyProjectsScreen() {
  const router = useRouter();
  const { currentEmployeeId } = useEmployee();
  
  const myProjects = getMyProjects(currentEmployeeId);

  const handleProjectPress = (projectId: string) => {
    router.push({
      pathname: routes.employeeProjectDetails,
      params: { projectId }
    } as any);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={iconSizes.lg} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Projects</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Project Count Badge */}
      <View style={styles.countContainer}>
        <View style={styles.countBadge}>
          <Feather name="briefcase" size={iconSizes.md} color={colors.primary} />
          <Text style={styles.countText}>
            {myProjects.length} {myProjects.length === 1 ? 'Project' : 'Projects'}
          </Text>
        </View>
      </View>

      {/* Projects List */}
      {myProjects.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="folder" size={iconSizes.xxxl} color={colors.gray300} />
          <Text style={styles.emptyTitle}>No Projects Assigned</Text>
          <Text style={styles.emptyDescription}>
            You don't have any projects assigned yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={myProjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.projectCard}
              onPress={() => handleProjectPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.projectHeader}>
                <View style={styles.projectIconContainer}>
                  <Feather name="folder" size={iconSizes.lg} color={colors.primary} />
                </View>
                <View style={styles.projectInfo}>
                  <Text style={styles.projectName}>{item.name}</Text>
                  <Text style={styles.projectDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <Feather name="chevron-right" size={iconSizes.md} color={colors.textSecondary} />
              </View>

              <View style={styles.projectFooter}>
                <View style={styles.memberCount}>
                  <Feather name="users" size={iconSizes.sm} color={colors.textSecondary} />
                  <Text style={styles.memberText}>
                    {item.assignedMembers.length} {item.assignedMembers.length === 1 ? 'member' : 'members'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundWhite,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: layout.headerPaddingTopSmall,
    paddingHorizontal: layout.headerPaddingHorizontal,
    paddingBottom: layout.headerPaddingBottom,
    backgroundColor: colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  placeholder: {
    width: iconSizes.lg + spacing.md,
  },
  countContainer: {
    paddingHorizontal: layout.containerPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  countBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.backgroundWhite,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  countText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  listContent: {
    padding: layout.containerPadding,
    paddingBottom: layout.scrollContentPaddingBottom,
  },
  projectCard: {
    backgroundColor: colors.backgroundWhite,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  projectIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  projectInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  projectName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  projectDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: fontSizes.sm * 1.5,
  },
  projectFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  memberText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: fontSizes.md * 1.5,
  },
});
