// ============================================================================
// SkillSwap - Client-Side Graph Engine with Local Storage Persistence
// Guarantees 100% full interactive graph functionality on Vercel Live URL
// ============================================================================

import { initialSeedData } from './seedData';

const STORAGE_KEY = 'SKILLSWAP_GRAPH_STATE_V1';

function getGraphState() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn('Failed to parse cached graph state, resetting...');
    }
  }
  const cloned = JSON.parse(JSON.stringify(initialSeedData));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
  return cloned;
}

function saveGraphState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const graphEngine = {
  // 1. Overview Stats
  getOverviewStats(userId = 'usr-kavya') {
    const state = getGraphState();
    const user = state.users.find(u => u.userId === userId) || state.users[0];
    const userTaught = state.userSkillsTaught.filter(s => s.userId === user.userId);
    const userWanted = state.userSkillsWanted.filter(s => s.userId === user.userId);
    const matches = this.findTwoWayMatches(user.userId);
    const sessions = state.sessions.filter(s => s.teacherId === user.userId || s.learnerId === user.userId);
    const swaps = state.swapRequests.filter(s => s.senderId === user.userId || s.receiverId === user.userId);

    return {
      success: true,
      data: {
        totalUsers: state.users.length,
        totalSkills: state.skills.length,
        totalCategories: state.categories.length,
        activeMatchesCount: matches.length,
        userSkillsTaughtCount: userTaught.length,
        userSkillsWantedCount: userWanted.length,
        scheduledSessionsCount: sessions.filter(s => s.status === 'SCHEDULED').length,
        completedSessionsCount: sessions.filter(s => s.status === 'COMPLETED').length,
        pendingSwapsCount: swaps.filter(s => s.status === 'PENDING').length
      }
    };
  },

  // 2. Users
  getAllUsers() {
    const state = getGraphState();
    const result = state.users.map(u => {
      const taught = state.userSkillsTaught
        .filter(st => st.userId === u.userId)
        .map(st => {
          const sk = state.skills.find(s => s.skillId === st.skillId);
          return sk ? { ...sk, proficiency: st.proficiency, experienceYears: st.experienceYears } : null;
        })
        .filter(Boolean);

      const wanted = state.userSkillsWanted
        .filter(sw => sw.userId === u.userId)
        .map(sw => {
          const sk = state.skills.find(s => s.skillId === sw.skillId);
          return sk ? { ...sk, priority: sw.priority, currentLevel: sw.currentLevel } : null;
        })
        .filter(Boolean);

      return {
        ...u,
        skillsTaught: taught,
        skillsWanted: wanted
      };
    });

    return { success: true, count: result.length, data: result };
  },

  getUserProfile(userId) {
    const state = getGraphState();
    const u = state.users.find(usr => usr.userId === userId) || state.users[0];
    if (!u) return { success: false, error: 'User not found' };

    const taught = state.userSkillsTaught
      .filter(st => st.userId === u.userId)
      .map(st => {
        const sk = state.skills.find(s => s.skillId === st.skillId);
        return sk ? { ...sk, proficiency: st.proficiency, experienceYears: st.experienceYears } : null;
      })
      .filter(Boolean);

    const wanted = state.userSkillsWanted
      .filter(sw => sw.userId === u.userId)
      .map(sw => {
        const sk = state.skills.find(s => s.skillId === sw.skillId);
        return sk ? { ...sk, priority: sw.priority, currentLevel: sw.currentLevel } : null;
      })
      .filter(Boolean);

    const userReviews = state.reviews
      .filter(r => r.targetUserId === u.userId)
      .map(r => {
        const author = state.users.find(usr => usr.userId === r.authorId);
        return { ...r, author };
      });

    return {
      success: true,
      data: {
        ...u,
        skillsTaught: taught,
        skillsWanted: wanted,
        reviews: userReviews
      }
    };
  },

  // 3. Add & Remove Skills
  addSkillTaught(userId, skillId, proficiency = 'Intermediate', experienceYears = 2) {
    const state = getGraphState();
    state.userSkillsTaught = state.userSkillsTaught.filter(s => !(s.userId === userId && s.skillId === skillId));
    state.userSkillsTaught.push({ userId, skillId, proficiency, experienceYears: Number(experienceYears) });
    saveGraphState(state);
    return this.getUserProfile(userId);
  },

  removeSkillTaught(userId, skillId) {
    const state = getGraphState();
    state.userSkillsTaught = state.userSkillsTaught.filter(s => !(s.userId === userId && s.skillId === skillId));
    saveGraphState(state);
    return this.getUserProfile(userId);
  },

  addSkillWanted(userId, skillId, priority = 'High', currentLevel = 'Beginner') {
    const state = getGraphState();
    state.userSkillsWanted = state.userSkillsWanted.filter(s => !(s.userId === userId && s.skillId === skillId));
    state.userSkillsWanted.push({ userId, skillId, priority, currentLevel });
    saveGraphState(state);
    return this.getUserProfile(userId);
  },

  removeSkillWanted(userId, skillId) {
    const state = getGraphState();
    state.userSkillsWanted = state.userSkillsWanted.filter(s => !(s.userId === userId && s.skillId === skillId));
    saveGraphState(state);
    return this.getUserProfile(userId);
  },

  // 4. Skills & Categories
  getAllCategories() {
    const state = getGraphState();
    return { success: true, count: state.categories.length, data: state.categories };
  },

  getAllSkills(categoryId = '', search = '') {
    const state = getGraphState();
    let result = state.skills;

    if (categoryId) {
      result = result.filter(s => s.categoryId === categoryId);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }

    const enhanced = result.map(s => {
      const teacherCount = state.userSkillsTaught.filter(st => st.skillId === s.skillId).length;
      const learnerCount = state.userSkillsWanted.filter(sw => sw.skillId === s.skillId).length;
      return { ...s, teacherCount, learnerCount };
    });

    return { success: true, count: enhanced.length, data: enhanced };
  },

  getSkillDetails(skillId) {
    const state = getGraphState();
    const skill = state.skills.find(s => s.skillId === skillId);
    if (!skill) return { success: false, error: 'Skill not found' };

    const teachers = state.userSkillsTaught
      .filter(st => st.skillId === skillId)
      .map(st => {
        const u = state.users.find(usr => usr.userId === st.userId);
        return u ? { ...u, proficiency: st.proficiency, experienceYears: st.experienceYears } : null;
      })
      .filter(Boolean);

    const related = state.skillRelations
      .filter(r => r.from === skillId || r.to === skillId)
      .map(r => {
        const otherId = r.from === skillId ? r.to : r.from;
        return state.skills.find(s => s.skillId === otherId);
      })
      .filter(Boolean);

    return {
      success: true,
      data: {
        ...skill,
        teachers,
        relatedSkills: related
      }
    };
  },

  getPrerequisitePath(skillName) {
    const state = getGraphState();
    const targetSkill = state.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (!targetSkill) {
      return { success: true, data: { skillName, sequence: [skillName], learningSequence: [skillName] } };
    }

    const sequence = [targetSkill.name];
    let currId = targetSkill.skillId;
    const visited = new Set([currId]);

    while (currId) {
      const prereq = state.skillPrerequisites.find(p => p.skill === currId);
      if (prereq && !visited.has(prereq.requires)) {
        visited.add(prereq.requires);
        const parentSkill = state.skills.find(s => s.skillId === prereq.requires);
        if (parentSkill) {
          sequence.push(parentSkill.name);
          currId = parentSkill.skillId;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return {
      success: true,
      data: {
        skillName: targetSkill.name,
        targetSkill: targetSkill.name,
        depth: sequence.length - 1,
        learningSequence: sequence
      }
    };
  },

  // 5. 2-Way Match Finder (⭐ Key Graph Logic)
  findTwoWayMatches(userId) {
    const state = getGraphState();
    const me = state.users.find(u => u.userId === userId);
    if (!me) return [];

    const myTaughtIds = new Set(state.userSkillsTaught.filter(s => s.userId === userId).map(s => s.skillId));
    const myWantedIds = new Set(state.userSkillsWanted.filter(s => s.userId === userId).map(s => s.skillId));

    const matches = [];

    for (const partner of state.users) {
      if (partner.userId === userId) continue;

      const partnerTaught = state.userSkillsTaught.filter(s => s.userId === partner.userId);
      const partnerWanted = state.userSkillsWanted.filter(s => s.userId === partner.userId);

      const skillsTheyTeach = partnerTaught
        .filter(pt => myWantedIds.has(pt.skillId))
        .map(pt => state.skills.find(s => s.skillId === pt.skillId))
        .filter(Boolean);

      const skillsYouTeach = partnerWanted
        .filter(pw => myTaughtIds.has(pw.skillId))
        .map(pw => state.skills.find(s => s.skillId === pw.skillId))
        .filter(Boolean);

      if (skillsTheyTeach.length > 0 && skillsYouTeach.length > 0) {
        let score = 70;
        if (skillsTheyTeach.length > 1) score += 10;
        if (skillsYouTeach.length > 1) score += 10;
        if (partner.rating >= 4.9) score += 5;
        if (score > 98) score = 98;

        matches.push({
          partner,
          skillsTheyTeach,
          skillsYouTeach,
          matchScore: score,
          explanation: `Direct reciprocal match: ${partner.name} teaches ${skillsTheyTeach[0]?.name} (which you want) and wants ${skillsYouTeach[0]?.name} (which you teach).`
        });
      }
    }

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  },

  getMatches(userId) {
    const matches = this.findTwoWayMatches(userId);
    return { success: true, count: matches.length, data: matches };
  },

  // 6. Multi-Hop Recommendations (2+ Hops)
  getMultiHopRecommendations(userId) {
    const state = getGraphState();
    const myWantedIds = new Set(state.userSkillsWanted.filter(s => s.userId === userId).map(s => s.skillId));
    const myTaughtIds = new Set(state.userSkillsTaught.filter(s => s.userId === userId).map(s => s.skillId));

    const recommendations = [];
    const seen = new Set();

    for (const targetSkillId of myWantedIds) {
      const targetSkill = state.skills.find(s => s.skillId === targetSkillId);
      if (!targetSkill) continue;

      const relatedSkillIds = state.skillRelations
        .filter(r => r.from === targetSkillId || r.to === targetSkillId)
        .map(r => r.from === targetSkillId ? r.to : r.from);

      for (const relSkillId of relatedSkillIds) {
        if (myWantedIds.has(relSkillId) || myTaughtIds.has(relSkillId)) continue;
        const relSkill = state.skills.find(s => s.skillId === relSkillId);
        if (!relSkill) continue;

        const teachers = state.userSkillsTaught.filter(st => st.skillId === relSkillId && st.userId !== userId);
        for (const teacherRecord of teachers) {
          const teacher = state.users.find(u => u.userId === teacherRecord.userId);
          const key = `${teacher.userId}-${relSkillId}`;
          if (!seen.has(key)) {
            seen.add(key);
            recommendations.push({
              teacher,
              targetSkill,
              relatedSkillTaught: relSkill,
              proficiency: teacherRecord.proficiency,
              experienceYears: teacherRecord.experienceYears,
              hopDistance: 2,
              reason: `Because you want to learn ${targetSkill.name}, you might benefit from learning related skill ${relSkill.name} taught by ${teacher.name}.`
            });
          }
        }
      }
    }

    return { success: true, count: recommendations.length, data: recommendations };
  },

  // 7. Swap Requests
  getSwapRequests(userId) {
    const state = getGraphState();
    const requests = state.swapRequests
      .filter(r => r.senderId === userId || r.receiverId === userId)
      .map(r => {
        const sender = state.users.find(u => u.userId === r.senderId);
        const receiver = state.users.find(u => u.userId === r.receiverId);
        const offeredSkill = state.skills.find(s => s.skillId === r.offeredSkillId);
        const wantedSkill = state.skills.find(s => s.skillId === r.wantedSkillId);

        return {
          ...r,
          isIncoming: r.receiverId === userId,
          sender,
          receiver,
          offeredSkill,
          wantedSkill
        };
      });

    return { success: true, count: requests.length, data: requests };
  },

  sendSwapRequest(senderId, receiverId, offeredSkillId, wantedSkillId, message = '') {
    const state = getGraphState();
    const newSwap = {
      swapId: `swp-${Date.now()}`,
      senderId,
      receiverId,
      offeredSkillId,
      wantedSkillId,
      message: message || 'Hi! Let us do a skill exchange session.',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    state.swapRequests.unshift(newSwap);
    saveGraphState(state);
    return { success: true, data: newSwap };
  },

  respondSwapRequest(swapId, status) {
    const state = getGraphState();
    const swap = state.swapRequests.find(s => s.swapId === swapId);
    if (swap) {
      swap.status = status;
      saveGraphState(state);
    }
    return { success: true, data: swap };
  },

  // 8. Sessions
  getSessions(userId) {
    const state = getGraphState();
    const sessions = state.sessions
      .filter(s => s.teacherId === userId || s.learnerId === userId)
      .map(s => {
        const teacher = state.users.find(u => u.userId === s.teacherId);
        const learner = state.users.find(u => u.userId === s.learnerId);
        const skill = state.skills.find(sk => sk.skillId === s.skillId);
        return {
          ...s,
          isTeacher: s.teacherId === userId,
          teacher,
          learner,
          skill
        };
      });

    return { success: true, count: sessions.length, data: sessions };
  },

  scheduleSession(swapId, teacherId, learnerId, skillId, date, time, mode = 'Google Meet / Online', meetingLink = 'https://meet.google.com/skillswap-room') {
    const state = getGraphState();
    const newSession = {
      sessionId: `ses-${Date.now()}`,
      swapId,
      teacherId,
      learnerId,
      skillId,
      date,
      time,
      mode,
      meetingLink,
      status: 'SCHEDULED'
    };
    state.sessions.unshift(newSession);
    saveGraphState(state);
    return { success: true, data: newSession };
  },

  completeSession(sessionId, rating = 5, comment = '') {
    const state = getGraphState();
    const session = state.sessions.find(s => s.sessionId === sessionId);
    if (session) {
      session.status = 'COMPLETED';
      if (comment) {
        state.reviews.unshift({
          reviewId: `rev-${Date.now()}`,
          authorId: session.learnerId,
          targetUserId: session.teacherId,
          rating: Number(rating),
          comment,
          createdAt: new Date().toISOString()
        });
      }
      saveGraphState(state);
    }
    return { success: true, data: session };
  },

  // 9. Full Graph Visualization & Shortest Path
  getGraph() {
    const state = getGraphState();
    const nodes = [];
    const edges = [];

    state.categories.forEach(c => {
      nodes.push({ id: c.categoryId, label: c.name, type: 'Category', icon: c.icon, group: 'category' });
    });

    state.skills.forEach(s => {
      nodes.push({ id: s.skillId, label: s.name, type: 'Skill', icon: s.icon, category: s.category, group: 'skill' });
      edges.push({ source: s.skillId, target: s.categoryId, label: 'BELONGS_TO' });
    });

    state.users.forEach(u => {
      nodes.push({ id: u.userId, label: u.name, type: 'User', avatar: u.avatar, rating: u.rating, role: u.experienceLevel, group: 'user' });
    });

    state.userSkillsTaught.forEach(st => {
      edges.push({ source: st.userId, target: st.skillId, label: 'HAS_SKILL', proficiency: st.proficiency });
    });

    state.userSkillsWanted.forEach(sw => {
      edges.push({ source: sw.userId, target: sw.skillId, label: 'WANTS_TO_LEARN', priority: sw.priority });
    });

    state.skillRelations.forEach(sr => {
      edges.push({ source: sr.from, target: sr.to, label: 'RELATED_TO' });
    });

    state.skillPrerequisites.forEach(sp => {
      edges.push({ source: sp.skill, target: sp.requires, label: 'REQUIRES' });
    });

    return {
      success: true,
      data: {
        nodes,
        edges,
        stats: {
          nodeCount: nodes.length,
          edgeCount: edges.length,
          userCount: state.users.length,
          skillCount: state.skills.length
        }
      }
    };
  },

  findShortestPath(sourceName, targetName) {
    const graph = this.getGraph().data;
    const sName = sourceName.trim().toLowerCase();
    const tName = targetName.trim().toLowerCase();

    const startNode = graph.nodes.find(n => n.label.toLowerCase() === sName || n.id.toLowerCase() === sName);
    const endNode = graph.nodes.find(n => n.label.toLowerCase() === tName || n.id.toLowerCase() === tName);

    if (!startNode || !endNode) {
      return {
        success: true,
        data: {
          found: false,
          message: `Could not locate "${!startNode ? sourceName : targetName}" in the graph.`
        }
      };
    }

    const adj = new Map();
    for (const node of graph.nodes) {
      adj.set(node.id, []);
    }
    for (const edge of graph.edges) {
      if (adj.has(edge.source) && adj.has(edge.target)) {
        adj.get(edge.source).push(edge.target);
        adj.get(edge.target).push(edge.source);
      }
    }

    const queue = [[startNode.id]];
    const visited = new Set([startNode.id]);
    let foundPath = null;

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];

      if (current === endNode.id) {
        foundPath = path;
        break;
      }

      for (const neighbor of adj.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    if (foundPath) {
      const nodeNames = foundPath.map(id => {
        const n = graph.nodes.find(node => node.id === id);
        return n ? n.label : id;
      });

      return {
        success: true,
        data: {
          found: true,
          hopCount: foundPath.length - 1,
          path: nodeNames,
          nodeIds: foundPath
        }
      };
    }

    return {
      success: true,
      data: {
        found: false,
        message: `No path found between ${sourceName} and ${targetName}.`
      }
    };
  }
};
