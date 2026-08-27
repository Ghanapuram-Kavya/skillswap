// ============================================================================
// SkillSwap - User & Profile Cypher Queries
// ============================================================================

// 1. Get user profile with skills taught, skills wanted, and average review rating
MATCH (u:User {userId: $userId})
OPTIONAL MATCH (u)-[ht:HAS_SKILL]->(taughtSkill:Skill)
OPTIONAL MATCH (u)-[wt:WANTS_TO_LEARN]->(wantedSkill:Skill)
OPTIONAL MATCH (r:Review)-[:FOR]->(u)
RETURN u.userId AS userId,
       u.name AS name,
       u.email AS email,
       u.bio AS bio,
       u.experienceLevel AS experienceLevel,
       u.location AS location,
       u.avatar AS avatar,
       u.rating AS rating,
       collect(DISTINCT {
         skillId: taughtSkill.skillId,
         name: taughtSkill.name,
         category: taughtSkill.category,
         proficiency: ht.proficiency,
         experienceYears: ht.experienceYears
       }) AS skillsTaught,
       collect(DISTINCT {
         skillId: wantedSkill.skillId,
         name: wantedSkill.name,
         category: wantedSkill.category,
         priority: wt.priority,
         currentLevel: wt.currentLevel
       }) AS skillsWanted,
       collect(DISTINCT r) AS reviews;

// 2. Add or update a skill the user can teach
MATCH (u:User {userId: $userId})
MATCH (s:Skill {skillId: $skillId})
MERGE (u)-[r:HAS_SKILL]->(s)
SET r.proficiency = $proficiency,
    r.experienceYears = $experienceYears
RETURN u, r, s;

// 3. Add or update a skill the user wants to learn
MATCH (u:User {userId: $userId})
MATCH (s:Skill {skillId: $skillId})
MERGE (u)-[r:WANTS_TO_LEARN]->(s)
SET r.priority = $priority,
    r.currentLevel = $currentLevel
RETURN u, r, s;
