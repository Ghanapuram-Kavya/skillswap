// ============================================================================
// SkillSwap - Direct 2-Way Skill Swap Matching Queries (⭐ Main Graph Query)
// ============================================================================

// 1. Direct Two-Way Skill-Swap Match Finder:
// Finds partners who can teach what you want to learn AND want to learn what you can teach!
MATCH (me:User {userId: $userId})-[w:WANTS_TO_LEARN]->(wantedSkill:Skill)<-[th:HAS_SKILL]-(partner:User)
MATCH (partner)-[pw:WANTS_TO_LEARN]->(offeredSkill:Skill)<-[mh:HAS_SKILL]-(me)
WHERE me <> partner
RETURN partner.userId AS partnerId,
       partner.name AS partnerName,
       partner.email AS partnerEmail,
       partner.bio AS partnerBio,
       partner.experienceLevel AS partnerExperience,
       partner.location AS partnerLocation,
       partner.avatar AS partnerAvatar,
       partner.rating AS partnerRating,
       collect(DISTINCT {
         skillId: wantedSkill.skillId,
         name: wantedSkill.name,
         category: wantedSkill.category,
         theirProficiency: th.proficiency,
         theirExpYears: th.experienceYears,
         yourPriority: w.priority
       }) AS skillsTheyTeach,
       collect(DISTINCT {
         skillId: offeredSkill.skillId,
         name: offeredSkill.name,
         category: offeredSkill.category,
         yourProficiency: mh.proficiency,
         theirPriority: pw.priority
       }) AS skillsYouTeach;
