// ============================================================================
// SkillSwap - Multi-Hop Indirect Learning Path & Recommendation Queries
// ============================================================================

// 1. Multi-Hop Related Skill Recommendations (2+ Hops)
// Traversal: User -> WANTS_TO_LEARN -> TargetSkill -> RELATED_TO -> RelatedSkill <- HAS_SKILL <- RecommendedUser
MATCH (me:User {userId: $userId})-[:WANTS_TO_LEARN]->(targetSkill:Skill)-[:RELATED_TO*1..2]-(relatedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
WHERE me <> partner 
  AND NOT (me)-[:WANTS_TO_LEARN]->(relatedSkill)
  AND NOT (me)-[:HAS_SKILL]->(relatedSkill)
RETURN partner.userId AS partnerId,
       partner.name AS partnerName,
       partner.avatar AS partnerAvatar,
       partner.rating AS partnerRating,
       partner.experienceLevel AS partnerExperience,
       targetSkill.name AS yourLearningGoal,
       relatedSkill.name AS relatedSkillTaught,
       th.proficiency AS proficiency,
       th.experienceYears AS experienceYears
LIMIT 20;

// 2. Prerequisite Learning Path Discovery (Variable Depth Traversal)
MATCH path = (s:Skill {skillId: $skillId})-[:REQUIRES*1..4]->(prereq:Skill)
RETURN s.name AS targetSkill,
       [node IN nodes(path) | node.name] AS learningSequence,
       length(path) AS prerequisiteDepth,
       prereq.name AS foundationSkill;
