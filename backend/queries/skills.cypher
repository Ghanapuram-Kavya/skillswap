// ============================================================================
// SkillSwap - Skill Catalog, Categories & Related Skills Queries
// ============================================================================

// 1. Get all skills grouped by category with teacher counts
MATCH (s:Skill)-[:BELONGS_TO]->(c:Category)
OPTIONAL MATCH (teacher:User)-[:HAS_SKILL]->(s)
OPTIONAL MATCH (learner:User)-[:WANTS_TO_LEARN]->(s)
RETURN s.skillId AS skillId,
       s.name AS name,
       s.category AS category,
       s.icon AS icon,
       s.description AS description,
       s.level AS level,
       c.name AS categoryName,
       count(DISTINCT teacher) AS teacherCount,
       count(DISTINCT learner) AS learnerCount
ORDER BY s.name ASC;

// 2. Get skill profile with related skills and prerequisites
MATCH (s:Skill {skillId: $skillId})
OPTIONAL MATCH (s)-[:RELATED_TO]-(rel:Skill)
OPTIONAL MATCH (s)-[:REQUIRES]->(prereq:Skill)
OPTIONAL MATCH (teacher:User)-[ht:HAS_SKILL]->(s)
RETURN s,
       collect(DISTINCT rel) AS relatedSkills,
       collect(DISTINCT prereq) AS prerequisites,
       collect(DISTINCT {
         userId: teacher.userId,
         name: teacher.name,
         avatar: teacher.avatar,
         rating: teacher.rating,
         experienceYears: ht.experienceYears,
         proficiency: ht.proficiency
       }) AS teachers;
