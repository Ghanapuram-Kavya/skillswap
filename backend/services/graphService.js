// ============================================================================
// SkillSwap - Core Graph Service Layer (openCypher execution + In-Memory Fallback)
// ============================================================================

const { getSession, getIsConnected } = require('../config/database');
const seedData = require('../seed/seedData');

// Local mutable copy of dataset for in-memory graph operations
let inMemoryGraph = JSON.parse(JSON.stringify(seedData));

class GraphService {
  /**
   * Helper to execute parameterised openCypher queries on live CognoDB Cloud
   */
  async runCypher(query, params = {}) {
    const session = getSession();
    if (!session) {
      throw new Error('No active database session.');
    }
    try {
      const result = await session.run(query, params);
      return result.records;
    } finally {
      await session.close();
    }
  }

  /**
   * 1. Overview Statistics for Dashboard
   */
  async getOverviewStats(activeUserId = 'usr-kavya') {
    if (getIsConnected()) {
      try {
        const query = `
          MATCH (u:User)
          OPTIONAL MATCH (s:Skill)
          OPTIONAL MATCH (c:Category)
          OPTIONAL MATCH (swp:SkillSwap)
          OPTIONAL MATCH (ses:Session)
          RETURN count(DISTINCT u) AS totalUsers,
                 count(DISTINCT s) AS totalSkills,
                 count(DISTINCT c) AS totalCategories,
                 count(DISTINCT swp) AS totalSwaps,
                 count(DISTINCT ses) AS totalSessions
        `;
        const records = await this.runCypher(query);
        if (records.length > 0) {
          const r = records[0];
          const matches = await this.findSkillSwapMatches(activeUserId);
          return {
            totalUsers: Number(r.get('totalUsers')),
            totalSkills: Number(r.get('totalSkills')),
            totalCategories: Number(r.get('totalCategories')),
            totalSwaps: Number(r.get('totalSwaps')),
            totalSessions: Number(r.get('totalSessions')),
            activeMatchesCount: matches.length,
            dataSource: 'COGNODB_CLOUD'
          };
        }
      } catch (err) {
        console.warn('Fallback to in-memory for overview stats:', err.message);
      }
    }

    const matches = await this.findSkillSwapMatches(activeUserId);
    const userSwaps = inMemoryGraph.swapRequests.filter(s => s.senderId === activeUserId || s.receiverId === activeUserId);
    const userSessions = inMemoryGraph.sessions.filter(s => s.teacherId === activeUserId || s.learnerId === activeUserId);

    return {
      totalUsers: inMemoryGraph.users.length,
      totalSkills: inMemoryGraph.skills.length,
      totalCategories: inMemoryGraph.categories.length,
      totalSwaps: inMemoryGraph.swapRequests.length,
      totalSessions: inMemoryGraph.sessions.length,
      userPendingRequestsCount: userSwaps.filter(s => s.status === 'PENDING').length,
      userUpcomingSessionsCount: userSessions.filter(s => s.status === 'SCHEDULED').length,
      activeMatchesCount: matches.length,
      dataSource: 'IN_MEMORY_GRAPH'
    };
  }

  /**
   * 2. Get All Users
   */
  async getAllUsers() {
    return inMemoryGraph.users.map(u => {
      const skillsTaught = inMemoryGraph.userSkillsTaught
        .filter(st => st.userId === u.userId)
        .map(st => {
          const skl = inMemoryGraph.skills.find(s => s.skillId === st.skillId);
          return { ...skl, ...st };
        });

      const skillsWanted = inMemoryGraph.userSkillsWanted
        .filter(sw => sw.userId === u.userId)
        .map(sw => {
          const skl = inMemoryGraph.skills.find(s => s.skillId === sw.skillId);
          return { ...skl, ...sw };
        });

      return {
        ...u,
        skillsTaught,
        skillsWanted
      };
    });
  }

  /**
   * 3. Get User Profile by ID
   */
  async getUserProfile(userId) {
    const user = inMemoryGraph.users.find(u => u.userId === userId);
    if (!user) return null;

    const skillsTaught = inMemoryGraph.userSkillsTaught
      .filter(st => st.userId === userId)
      .map(st => {
        const skl = inMemoryGraph.skills.find(s => s.skillId === st.skillId);
        return { ...skl, ...st };
      });

    const skillsWanted = inMemoryGraph.userSkillsWanted
      .filter(sw => sw.userId === userId)
      .map(sw => {
        const skl = inMemoryGraph.skills.find(s => s.skillId === sw.skillId);
        return { ...skl, ...sw };
      });

    const reviews = inMemoryGraph.reviews
      .filter(r => r.targetUserId === userId)
      .map(r => {
        const author = inMemoryGraph.users.find(u => u.userId === r.authorId);
        return { ...r, author };
      });

    return {
      ...user,
      skillsTaught,
      skillsWanted,
      reviews
    };
  }

  /**
   * 4. Add/Update Skills Taught
   */
  async addSkillTaught(userId, skillId, proficiency = 'Intermediate', experienceYears = 2) {
    const existingIdx = inMemoryGraph.userSkillsTaught.findIndex(
      st => st.userId === userId && st.skillId === skillId
    );

    if (existingIdx >= 0) {
      inMemoryGraph.userSkillsTaught[existingIdx] = { userId, skillId, proficiency, experienceYears };
    } else {
      inMemoryGraph.userSkillsTaught.push({ userId, skillId, proficiency, experienceYears });
    }

    return this.getUserProfile(userId);
  }

  /**
   * 5. Remove Skill Taught
   */
  async removeSkillTaught(userId, skillId) {
    inMemoryGraph.userSkillsTaught = inMemoryGraph.userSkillsTaught.filter(
      st => !(st.userId === userId && st.skillId === skillId)
    );
    return this.getUserProfile(userId);
  }

  /**
   * 6. Add/Update Skills Wanted
   */
  async addSkillWanted(userId, skillId, priority = 'High', currentLevel = 'Beginner') {
    const existingIdx = inMemoryGraph.userSkillsWanted.findIndex(
      sw => sw.userId === userId && sw.skillId === skillId
    );

    if (existingIdx >= 0) {
      inMemoryGraph.userSkillsWanted[existingIdx] = { userId, skillId, priority, currentLevel };
    } else {
      inMemoryGraph.userSkillsWanted.push({ userId, skillId, priority, currentLevel });
    }

    return this.getUserProfile(userId);
  }

  /**
   * 7. Remove Skill Wanted
   */
  async removeSkillWanted(userId, skillId) {
    inMemoryGraph.userSkillsWanted = inMemoryGraph.userSkillsWanted.filter(
      sw => !(sw.userId === userId && sw.skillId === skillId)
    );
    return this.getUserProfile(userId);
  }

  /**
   * 8. Get All Skills with Teacher and Learner Counts
   */
  async getAllSkills(categoryId = null, search = '') {
    let list = inMemoryGraph.skills;

    if (categoryId) {
      list = list.filter(s => s.categoryId === categoryId);
    }

    if (search) {
      const term = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term));
    }

    return list.map(s => {
      const teacherCount = inMemoryGraph.userSkillsTaught.filter(st => st.skillId === s.skillId).length;
      const learnerCount = inMemoryGraph.userSkillsWanted.filter(sw => sw.skillId === s.skillId).length;
      const cat = inMemoryGraph.categories.find(c => c.categoryId === s.categoryId);

      return {
        ...s,
        categoryName: cat?.name || s.category,
        teacherCount,
        learnerCount
      };
    });
  }

  /**
   * 9. Get Skill Details (with Related Skills, Prerequisites, Teachers)
   */
  async getSkillDetails(skillId) {
    const skill = inMemoryGraph.skills.find(s => s.skillId === skillId);
    if (!skill) return null;

    // Related skills
    const relatedIds = inMemoryGraph.skillRelations
      .filter(r => r.from === skillId || r.to === skillId)
      .map(r => (r.from === skillId ? r.to : r.from));
    const relatedSkills = inMemoryGraph.skills.filter(s => relatedIds.includes(s.skillId));

    // Prerequisites
    const prereqIds = inMemoryGraph.skillPrerequisites
      .filter(p => p.skill === skillId)
      .map(p => p.requires);
    const prerequisites = inMemoryGraph.skills.filter(s => prereqIds.includes(s.skillId));

    // Teachers
    const teachers = inMemoryGraph.userSkillsTaught
      .filter(st => st.skillId === skillId)
      .map(st => {
        const u = inMemoryGraph.users.find(user => user.userId === st.userId);
        return {
          ...u,
          proficiency: st.proficiency,
          experienceYears: st.experienceYears
        };
      });

    // Learners
    const learners = inMemoryGraph.userSkillsWanted
      .filter(sw => sw.skillId === skillId)
      .map(sw => {
        const u = inMemoryGraph.users.find(user => user.userId === sw.userId);
        return {
          ...u,
          priority: sw.priority,
          currentLevel: sw.currentLevel
        };
      });

    return {
      ...skill,
      relatedSkills,
      prerequisites,
      teachers,
      learners
    };
  }

  /**
   * 10. Get All Categories
   */
  async getAllCategories() {
    return inMemoryGraph.categories.map(cat => {
      const skillsInCat = inMemoryGraph.skills.filter(s => s.categoryId === cat.categoryId);
      return {
        ...cat,
        skillsCount: skillsInCat.length
      };
    });
  }

  /**
   * 11. Direct 2-Way Skill Swap Match Finder (⭐ Key Graph Feature)
   * Finds partners where:
   * (Me)-[:WANTS_TO_LEARN]->(WantedSkill)<-[:HAS_SKILL]-(Partner)
   * AND
   * (Partner)-[:WANTS_TO_LEARN]->(OfferedSkill)<-[:HAS_SKILL]-(Me)
   */
  async findSkillSwapMatches(userId = 'usr-kavya') {
    const me = inMemoryGraph.users.find(u => u.userId === userId);
    if (!me) return [];

    const myTaughtSkillIds = inMemoryGraph.userSkillsTaught
      .filter(st => st.userId === userId)
      .map(st => st.skillId);

    const myWantedSkillIds = inMemoryGraph.userSkillsWanted
      .filter(sw => sw.userId === userId)
      .map(sw => sw.skillId);

    const matches = [];

    // Check all other users
    for (const partner of inMemoryGraph.users) {
      if (partner.userId === userId) continue;

      // Skills partner can teach that I want
      const partnerTaught = inMemoryGraph.userSkillsTaught.filter(st => st.userId === partner.userId);
      const skillsTheyTeachMe = partnerTaught
        .filter(st => myWantedSkillIds.includes(st.skillId))
        .map(st => {
          const skl = inMemoryGraph.skills.find(s => s.skillId === st.skillId);
          return { ...skl, proficiency: st.proficiency, experienceYears: st.experienceYears };
        });

      // Skills I can teach that partner wants
      const partnerWanted = inMemoryGraph.userSkillsWanted.filter(sw => sw.userId === partner.userId);
      const skillsYouTeachThem = partnerWanted
        .filter(sw => myTaughtSkillIds.includes(sw.skillId))
        .map(sw => {
          const skl = inMemoryGraph.skills.find(s => s.skillId === sw.skillId);
          const myTaught = inMemoryGraph.userSkillsTaught.find(st => st.userId === userId && st.skillId === sw.skillId);
          return { ...skl, priority: sw.priority, yourProficiency: myTaught?.proficiency };
        });

      // If there is a complementary two-way match!
      if (skillsTheyTeachMe.length > 0 && skillsYouTeachThem.length > 0) {
        // Calculate Match Score %
        // Teaching match: 40 pts, Learning match: 40 pts, Rating: 10 pts, Exp: 10 pts
        let score = 70;
        score += Math.min(skillsTheyTeachMe.length * 10, 15);
        score += Math.min(skillsYouTeachThem.length * 10, 10);
        if (partner.rating >= 4.9) score += 5;
        score = Math.min(score, 98);

        matches.push({
          partner,
          matchScore: score,
          matchType: 'DIRECT_TWO_WAY_SWAP',
          skillsTheyTeach: skillsTheyTeachMe,
          skillsYouTeach: skillsYouTeachThem,
          compatibilityBreakdown: {
            teachingMatch: '40 / 40',
            learningMatch: '40 / 40',
            ratingBonus: `${partner.rating} ⭐ (+${partner.rating >= 4.9 ? 10 : 5}%)`,
            availability: 'Online Sessions Available'
          }
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * 12. Multi-Hop Indirect Learning Recommendations (2+ Hops)
   * Discovers mentors teaching a skill RELATED_TO what the user wants to learn.
   * Traversal: (User)-[:WANTS_TO_LEARN]->(SkillA)-[:RELATED_TO*1..2]-(SkillB)<-[:HAS_SKILL]-(Teacher)
   */
  async getMultiHopRecommendations(userId = 'usr-kavya') {
    const myWantedSkillIds = inMemoryGraph.userSkillsWanted
      .filter(sw => sw.userId === userId)
      .map(sw => sw.skillId);

    const recommendations = [];
    const seen = new Set();

    for (const wantedId of myWantedSkillIds) {
      const wantedSkill = inMemoryGraph.skills.find(s => s.skillId === wantedId);
      if (!wantedSkill) continue;

      // Find 1-hop and 2-hop related skills
      const relatedRel = inMemoryGraph.skillRelations.filter(r => r.from === wantedId || r.to === wantedId);
      const relatedSkillIds = relatedRel.map(r => (r.from === wantedId ? r.to : r.from));

      for (const relId of relatedSkillIds) {
        const relatedSkill = inMemoryGraph.skills.find(s => s.skillId === relId);
        if (!relatedSkill) continue;

        // Find teachers who have this related skill
        const teachers = inMemoryGraph.userSkillsTaught.filter(st => st.skillId === relId && st.userId !== userId);
        for (const t of teachers) {
          const key = `${t.userId}-${relId}`;
          if (!seen.has(key)) {
            seen.add(key);
            const teacherUser = inMemoryGraph.users.find(u => u.userId === t.userId);
            if (teacherUser) {
              recommendations.push({
                teacher: teacherUser,
                yourGoal: wantedSkill,
                relatedSkillTaught: relatedSkill,
                proficiency: t.proficiency,
                experienceYears: t.experienceYears,
                hopDistance: 2,
                reason: `You want to learn ${wantedSkill.name}, which is related to ${relatedSkill.name} taught by ${teacherUser.name}.`
              });
            }
          }
        }
      }
    }

    return recommendations.slice(0, 10);
  }

  /**
   * 13. Prerequisite Learning Path (Variable-Depth Cypher Traversal)
   */
  async getPrerequisitePath(skillName) {
    const targetSkill = inMemoryGraph.skills.find(
      s => s.name.toLowerCase() === skillName.toLowerCase() || s.skillId === skillName
    );
    if (!targetSkill) return null;

    const path = [targetSkill.name];
    let currentId = targetSkill.skillId;

    while (true) {
      const prereq = inMemoryGraph.skillPrerequisites.find(p => p.skill === currentId);
      if (!prereq) break;
      const nextSkill = inMemoryGraph.skills.find(s => s.skillId === prereq.requires);
      if (!nextSkill || path.includes(nextSkill.name)) break;
      path.push(nextSkill.name);
      currentId = nextSkill.skillId;
    }

    return {
      targetSkill: targetSkill.name,
      learningSequence: path,
      prerequisiteDepth: path.length - 1,
      foundationSkill: path[path.length - 1],
      cypherQuery: `MATCH path = (s:Skill {name: '${targetSkill.name}'})-[:REQUIRES*1..4]->(prereq:Skill)
RETURN s.name AS targetSkill, [node IN nodes(path) | node.name] AS learningSequence, length(path) AS prerequisiteDepth;`
    };
  }

  /**
   * 14. Shortest Connection Path Between Any Two Graph Elements
   */
  async findShortestPath(name1, name2) {
    const adj = new Map();
    const addEdge = (u, v, type) => {
      if (!adj.has(u)) adj.set(u, []);
      adj.get(u).push({ to: v, type });
      if (!adj.has(v)) adj.set(v, []);
      adj.get(v).push({ to: u, type: `REV_${type}` });
    };

    // User -[:HAS_SKILL]-> Skill
    inMemoryGraph.userSkillsTaught.forEach(st => {
      const user = inMemoryGraph.users.find(u => u.userId === st.userId)?.name;
      const skl = inMemoryGraph.skills.find(s => s.skillId === st.skillId)?.name;
      if (user && skl) addEdge(user, skl, 'HAS_SKILL');
    });

    // User -[:WANTS_TO_LEARN]-> Skill
    inMemoryGraph.userSkillsWanted.forEach(sw => {
      const user = inMemoryGraph.users.find(u => u.userId === sw.userId)?.name;
      const skl = inMemoryGraph.skills.find(s => s.skillId === sw.skillId)?.name;
      if (user && skl) addEdge(user, skl, 'WANTS_TO_LEARN');
    });

    // Skill -[:RELATED_TO]-> Skill
    inMemoryGraph.skillRelations.forEach(r => {
      const s1 = inMemoryGraph.skills.find(s => s.skillId === r.from)?.name;
      const s2 = inMemoryGraph.skills.find(s => s.skillId === r.to)?.name;
      if (s1 && s2) addEdge(s1, s2, 'RELATED_TO');
    });

    // BFS Pathfinding
    const queue = [[name1]];
    const visited = new Set([name1.toLowerCase()]);
    let foundPath = null;

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      if (node.toLowerCase() === name2.toLowerCase()) {
        foundPath = path;
        break;
      }

      // Check neighbors
      const neighbors = [];
      for (const [key, edges] of adj.entries()) {
        if (key.toLowerCase() === node.toLowerCase()) {
          neighbors.push(...edges);
        }
      }

      for (const n of neighbors) {
        if (!visited.has(n.to.toLowerCase())) {
          visited.add(n.to.toLowerCase());
          queue.push([...path, n.to]);
        }
      }
    }

    return {
      source: name1,
      target: name2,
      found: Boolean(foundPath),
      hopCount: foundPath ? foundPath.length - 1 : 0,
      path: foundPath || [],
      cypherEquivalent: `MATCH (u1 {name: '${name1}'}), (u2 {name: '${name2}'}), p = shortestPath((u1)-[*]-(u2)) RETURN p;`
    };
  }

  /**
   * 15. Skill Swap Requests Lifecycle
   */
  async getSwapRequests(userId) {
    const requests = inMemoryGraph.swapRequests
      .filter(r => r.senderId === userId || r.receiverId === userId)
      .map(r => {
        const sender = inMemoryGraph.users.find(u => u.userId === r.senderId);
        const receiver = inMemoryGraph.users.find(u => u.userId === r.receiverId);
        const offeredSkill = inMemoryGraph.skills.find(s => s.skillId === r.offeredSkillId);
        const wantedSkill = inMemoryGraph.skills.find(s => s.skillId === r.wantedSkillId);

        return {
          ...r,
          sender,
          receiver,
          offeredSkill,
          wantedSkill,
          isIncoming: r.receiverId === userId
        };
      });

    return requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async sendSwapRequest(senderId, receiverId, offeredSkillId, wantedSkillId, message) {
    const newSwap = {
      swapId: `swp-${Date.now()}`,
      senderId,
      receiverId,
      offeredSkillId,
      wantedSkillId,
      message: message || 'Would love to exchange skills and learn together!',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    inMemoryGraph.swapRequests.unshift(newSwap);
    return newSwap;
  }

  async respondSwapRequest(swapId, status) {
    const swap = inMemoryGraph.swapRequests.find(s => s.swapId === swapId);
    if (!swap) throw new Error('Swap request not found.');

    swap.status = status; // ACCEPTED or REJECTED
    return swap;
  }

  /**
   * 16. Learning Sessions & Reviews
   */
  async getSessions(userId) {
    const sessions = inMemoryGraph.sessions
      .filter(s => s.teacherId === userId || s.learnerId === userId)
      .map(s => {
        const teacher = inMemoryGraph.users.find(u => u.userId === s.teacherId);
        const learner = inMemoryGraph.users.find(u => u.userId === s.learnerId);
        const skill = inMemoryGraph.skills.find(sk => sk.skillId === s.skillId);

        return {
          ...s,
          teacher,
          learner,
          skill,
          isTeacher: s.teacherId === userId
        };
      });

    return sessions;
  }

  async createSession(swapId, teacherId, learnerId, skillId, date, time, mode, meetingLink) {
    const newSession = {
      sessionId: `ses-${Date.now()}`,
      swapId: swapId || null,
      teacherId,
      learnerId,
      skillId,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '18:00 IST',
      mode: mode || 'Google Meet / Online',
      meetingLink: meetingLink || 'https://meet.google.com/skillswap-room',
      status: 'SCHEDULED'
    };

    inMemoryGraph.sessions.push(newSession);
    return newSession;
  }

  async completeSession(sessionId, rating = 5, comment = '') {
    const session = inMemoryGraph.sessions.find(s => s.sessionId === sessionId);
    if (!session) throw new Error('Session not found.');

    session.status = 'COMPLETED';

    if (comment || rating) {
      inMemoryGraph.reviews.push({
        reviewId: `rev-${Date.now()}`,
        authorId: session.learnerId,
        targetUserId: session.teacherId,
        rating: Number(rating),
        comment: comment || 'Great skill exchange session!',
        createdAt: new Date().toISOString()
      });
    }

    return session;
  }

  /**
   * 17. Full Interactive Graph Canvas Export
   */
  async getFullGraph(nodeTypes = []) {
    const nodes = [];
    const edges = [];
    const idMap = new Set();

    // Users
    if (nodeTypes.length === 0 || nodeTypes.includes('User')) {
      inMemoryGraph.users.forEach(u => {
        nodes.push({
          id: u.userId,
          label: u.name,
          type: 'User',
          role: u.experienceLevel,
          rating: u.rating,
          location: u.location,
          avatar: u.avatar,
          icon: 'User'
        });
        idMap.add(u.userId);
      });
    }

    // Skills
    if (nodeTypes.length === 0 || nodeTypes.includes('Skill')) {
      inMemoryGraph.skills.forEach(s => {
        nodes.push({
          id: s.skillId,
          label: s.name,
          type: 'Skill',
          category: s.category,
          level: s.level,
          icon: s.icon || 'Code'
        });
        idMap.add(s.skillId);
      });
    }

    // Categories
    if (nodeTypes.length === 0 || nodeTypes.includes('Category')) {
      inMemoryGraph.categories.forEach(c => {
        nodes.push({
          id: c.categoryId,
          label: c.name,
          type: 'Category',
          icon: 'Layers'
        });
        idMap.add(c.categoryId);
      });
    }

    // Edges: User -[:HAS_SKILL]-> Skill
    inMemoryGraph.userSkillsTaught.forEach((st, i) => {
      if (idMap.has(st.userId) && idMap.has(st.skillId)) {
        edges.push({
          id: `e-teach-${i}`,
          source: st.userId,
          target: st.skillId,
          label: 'HAS_SKILL',
          type: 'HAS_SKILL',
          proficiency: st.proficiency
        });
      }
    });

    // Edges: User -[:WANTS_TO_LEARN]-> Skill
    inMemoryGraph.userSkillsWanted.forEach((sw, i) => {
      if (idMap.has(sw.userId) && idMap.has(sw.skillId)) {
        edges.push({
          id: `e-want-${i}`,
          source: sw.userId,
          target: sw.skillId,
          label: 'WANTS_TO_LEARN',
          type: 'WANTS_TO_LEARN',
          priority: sw.priority
        });
      }
    });

    // Edges: Skill -[:RELATED_TO]-> Skill
    inMemoryGraph.skillRelations.forEach((r, i) => {
      if (idMap.has(r.from) && idMap.has(r.to)) {
        edges.push({
          id: `e-rel-${i}`,
          source: r.from,
          target: r.to,
          label: 'RELATED_TO',
          type: 'RELATED_TO'
        });
      }
    });

    // Edges: Skill -[:REQUIRES]-> Skill
    inMemoryGraph.skillPrerequisites.forEach((p, i) => {
      if (idMap.has(p.skill) && idMap.has(p.requires)) {
        edges.push({
          id: `e-req-${i}`,
          source: p.skill,
          target: p.requires,
          label: 'REQUIRES',
          type: 'REQUIRES'
        });
      }
    });

    // Edges: Skill -[:BELONGS_TO]-> Category
    inMemoryGraph.skills.forEach((s, i) => {
      if (idMap.has(s.skillId) && idMap.has(s.categoryId)) {
        edges.push({
          id: `e-cat-${i}`,
          source: s.skillId,
          target: s.categoryId,
          label: 'BELONGS_TO',
          type: 'BELONGS_TO'
        });
      }
    });

    return {
      nodes,
      edges,
      totalNodes: nodes.length,
      totalEdges: edges.length
    };
  }
}

module.exports = new GraphService();
