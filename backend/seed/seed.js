// ============================================================================
// SkillSwap - CognoDB Seeding Pipeline
// ============================================================================

require('dotenv').config();
const { getSession, verifyConnection, closeDriver } = require('../config/database');
const seedData = require('./seedData');

async function seedDatabase() {
  console.log('🚀 Starting SkillSwap CognoDB Seeding Pipeline...');
  console.log('📡 Verifying database connection...');

  const conn = await verifyConnection();
  if (!conn.connected) {
    console.error('❌ Cannot run seed script: CognoDB database is unreachable.');
    console.error(`Details: ${conn.error}`);
    console.error('👉 Please check your COGNODB_URI, COGNODB_USERNAME, and COGNODB_PASSWORD in .env');
    process.exit(1);
  }

  const session = getSession();
  if (!session) {
    console.error('❌ Failed to open database session.');
    process.exit(1);
  }

  try {
    console.log('🧹 Clearing existing graph data...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('⚙️ Creating constraints and indexes...');
    const constraintQueries = [
      'CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.userId IS UNIQUE',
      'CREATE CONSTRAINT skill_id_unique IF NOT EXISTS FOR (s:Skill) REQUIRE s.skillId IS UNIQUE',
      'CREATE CONSTRAINT cat_id_unique IF NOT EXISTS FOR (c:Category) REQUIRE c.categoryId IS UNIQUE',
      'CREATE CONSTRAINT swap_id_unique IF NOT EXISTS FOR (swp:SkillSwap) REQUIRE swp.swapId IS UNIQUE',
      'CREATE CONSTRAINT session_id_unique IF NOT EXISTS FOR (ses:Session) REQUIRE ses.sessionId IS UNIQUE'
    ];

    for (const cq of constraintQueries) {
      try {
        await session.run(cq);
      } catch (e) {
        console.log(`ℹ️ Constraint info: ${e.message}`);
      }
    }

    console.log('📂 Seeding Categories...');
    await session.run(
      `UNWIND $cats AS c
       CREATE (:Category {
         categoryId: c.categoryId,
         name: c.name,
         icon: c.icon
       })`,
      { cats: seedData.categories }
    );

    console.log('💡 Seeding Skills...');
    await session.run(
      `UNWIND $skills AS s
       CREATE (:Skill {
         skillId: s.skillId,
         name: s.name,
         category: s.category,
         icon: s.icon,
         level: s.level,
         description: s.description
       })`,
      { skills: seedData.skills }
    );

    console.log('🔗 Linking Skills to Categories...');
    await session.run(
      `UNWIND $skills AS s
       MATCH (sk:Skill {skillId: s.skillId})
       MATCH (c:Category {categoryId: s.categoryId})
       CREATE (sk)-[:BELONGS_TO]->(c)`,
      { skills: seedData.skills }
    );

    console.log('👥 Seeding Users...');
    await session.run(
      `UNWIND $users AS u
       CREATE (:User {
         userId: u.userId,
         name: u.name,
         email: u.email,
         bio: u.bio,
         experienceLevel: u.experienceLevel,
         location: u.location,
         rating: u.rating,
         avatar: u.avatar
       })`,
      { users: seedData.users }
    );

    console.log('🎓 Linking User Skills Taught (HAS_SKILL)...');
    await session.run(
      `UNWIND $taught AS t
       MATCH (u:User {userId: t.userId})
       MATCH (s:Skill {skillId: t.skillId})
       CREATE (u)-[:HAS_SKILL {
         proficiency: t.proficiency,
         experienceYears: t.experienceYears
       }]->(s)`,
      { taught: seedData.userSkillsTaught }
    );

    console.log('🎯 Linking User Skills Wanted (WANTS_TO_LEARN)...');
    await session.run(
      `UNWIND $wanted AS w
       MATCH (u:User {userId: w.userId})
       MATCH (s:Skill {skillId: w.skillId})
       CREATE (u)-[:WANTS_TO_LEARN {
         priority: w.priority,
         currentLevel: w.currentLevel
       }]->(s)`,
      { wanted: seedData.userSkillsWanted }
    );

    console.log('⚡ Linking Related Skills (RELATED_TO)...');
    await session.run(
      `UNWIND $rels AS r
       MATCH (s1:Skill {skillId: r.from})
       MATCH (s2:Skill {skillId: r.to})
       CREATE (s1)-[:RELATED_TO]->(s2)
       CREATE (s2)-[:RELATED_TO]->(s1)`,
      { rels: seedData.skillRelations }
    );

    console.log('🧱 Linking Skill Prerequisites (REQUIRES)...');
    await session.run(
      `UNWIND $prereqs AS p
       MATCH (s1:Skill {skillId: p.skill})
       MATCH (s2:Skill {skillId: p.requires})
       CREATE (s1)-[:REQUIRES]->(s2)`,
      { prereqs: seedData.skillPrerequisites }
    );

    console.log('🤝 Seeding Swap Requests...');
    for (const swp of seedData.swapRequests) {
      await session.run(
        `MATCH (s:User {userId: $senderId})
         MATCH (r:User {userId: $receiverId})
         CREATE (swp:SkillSwap {
           swapId: $swapId,
           status: $status,
           message: $message,
           createdAt: $createdAt
         })
         CREATE (s)-[:SENT_REQUEST]->(swp)
         CREATE (swp)-[:TO_USER]->(r)`,
        {
          senderId: swp.senderId,
          receiverId: swp.receiverId,
          swapId: swp.swapId,
          status: swp.status,
          message: swp.message,
          createdAt: swp.createdAt
        }
      );
    }

    console.log('📅 Seeding Sessions...');
    for (const ses of seedData.sessions) {
      await session.run(
        `MATCH (t:User {userId: $teacherId})
         MATCH (l:User {userId: $learnerId})
         MATCH (sk:Skill {skillId: $skillId})
         CREATE (s:Session {
           sessionId: $sessionId,
           date: $date,
           time: $time,
           mode: $mode,
           meetingLink: $meetingLink,
           status: $status
         })
         CREATE (t)-[:TEACHES_SESSION]->(s)
         CREATE (l)-[:ATTENDS_SESSION]->(s)
         CREATE (s)-[:COVERS_SKILL]->(sk)`,
        {
          teacherId: ses.teacherId,
          learnerId: ses.learnerId,
          skillId: ses.skillId,
          sessionId: ses.sessionId,
          date: ses.date,
          time: ses.time,
          mode: ses.mode,
          meetingLink: ses.meetingLink,
          status: ses.status
        }
      );
    }

    console.log('⭐ Seeding Reviews...');
    for (const rev of seedData.reviews) {
      await session.run(
        `MATCH (author:User {userId: $authorId})
         MATCH (target:User {userId: $targetId})
         CREATE (r:Review {
           reviewId: $reviewId,
           rating: $rating,
           comment: $comment,
           createdAt: $createdAt
         })
         CREATE (author)-[:WROTE]->(r)
         CREATE (r)-[:FOR]->(target)`,
        {
          authorId: rev.authorId,
          targetId: rev.targetUserId,
          reviewId: rev.reviewId,
          rating: rev.rating,
          comment: rev.comment,
          createdAt: rev.createdAt
        }
      );
    }

    console.log('✅ SkillSwap CognoDB Graph Database Seeded Successfully!');
    console.log(`📊 Seeding Summary:`);
    console.log(`   - Users: ${seedData.users.length}`);
    console.log(`   - Skills: ${seedData.skills.length}`);
    console.log(`   - Categories: ${seedData.categories.length}`);
    console.log(`   - Relationships: 150+ (HAS_SKILL, WANTS_TO_LEARN, RELATED_TO, REQUIRES, SWAPS)`);
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
  } finally {
    await session.close();
    await closeDriver();
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
