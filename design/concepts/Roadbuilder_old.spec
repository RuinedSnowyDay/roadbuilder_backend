<concept_spec>
concept RoadBuilder

purpose
    organize different roadmaps according to their titles, store concept
    maps for each roadmap

principle
    you can create new roadmaps by providing title and description;
    you can access, edit, or delete roadmaps;
    you can get AI suggestions for new study topics;
    you add concepts to roadmaps and connect them through prerequisite relations;
    you can get AI suggestions for concepts and relationships

state

    a set of Roadmap with
        a title String
        a description String

    a set of Concept with
        a parent roadmap Roadmap
        a title String

    a set of Relation with
        a parent Concept
        a child Concept

    a set of Resource with
        a parent Concept
        a title String
        a content String
        a completed Boolean

    invariants
        every concept belongs to exactly one roadmap
        every relation connects concepts from the same roadmap
        every resource belongs to exactly one concept
        roadmap titles are unique
        concept titles are unique per roadmap
        resource titles are unique per concept

actions
    createRoadmap(title: String, description: String): Roadmap
        requires no roadmap with same title exists
        effect creates fresh roadmap with title and description and returns it

    deleteRoadmap(roadmap: Roadmap)
        requires roadmap exists
        effect removes roadmap from the set of roadmaps

    changeRoadmapTitle(roadmap: Roadmap, newTitle: String)
        requires roadmap exists, no other roadmap has newTitle
        effect changes roadmap title to newTitle

    changeRoadmapDescription(roadmap: Roadmap, newDescription: String)
        requires roadmap exists
        effect changes roadmap description to newDescription

    getRoadmap(title: String): Roadmap
        requires roadmap with title exists
        effect returns roadmap with given title

    addConcept(roadmap: Roadmap, title: String): Concept
        requires roadmap exists, roadmap doesn't have concept with same title
        effect creates concept with title in roadmap and returns it

    deleteConcept(concept: Concept)
        requires concept exists
        effect removes concept and all its relations and resources

    editConcept(concept: Concept, newTitle: String)
        requires concept exists, no other concept in same roadmap has newTitle
        effect changes concept title to newTitle

    addRelation(parentConcept: Concept, childConcept: Concept)
        requires both concepts exist, belong to same roadmap, no relation already
        exists between them, no circular dependency would be created
        effect creates relation from parentConcept to childConcept

    removeRelation(parentConcept: Concept, childConcept: Concept)
        requires relation exists between parentConcept and childConcept
        effect removes relation between parentConcept and childConcept

    addResource(concept: Concept, title: String, content: String): Resource
        requires concept exists, concept doesn't have resource with same title
        effect creates new resource with title and content for concept and returns it

    removeResource(resource: Resource)
        requires resource exists
        effect removes resource

    markResourceCompleted(resource: Resource)
        requires resource exists
        effect sets resource completed to true

    markResourceIncomplete(resource: Resource)
        requires resource exists
        effect sets resource completed to false

    async suggestTopicLLM(llm: GeminiLLM): Roadmap
        requires nothing
        effect uses llm to suggest a new study topic and creates roadmap for it

    async suggestConceptLLM(roadmap: Roadmap, llm: GeminiLLM): Concept
        requires roadmap exists
        effect uses llm to suggest a new concept for the roadmap and creates it

    async suggestRelationLLM(roadmap: Roadmap, llm: GeminiLLM): {parent: Concept, child: Concept}
        requires roadmap exists, roadmap has at least 2 concepts
        effect uses llm to suggest a prerequisite relation between two concepts in roadmap

notes
    This concept demonstrates a learning roadmap system with AI assistance.
    Roadmaps are organized as directed graphs where concepts are nodes and
    prerequisite relations are edges. AI can suggest new topics, concepts,
    and relationships to help build comprehensive learning paths.

</concept_spec>
