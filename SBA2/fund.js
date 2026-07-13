// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submissions) {
    if (course.id !== ag.course_id) {
        throw new Error("Assignment group does not belong to this course.");
    }
  const result = [];
  //collecting usable assignments
  const validAssignments = [];
  const currentDate = new Date ();

  for(let i = 0; i < ag.assignments.length; i++){
    const assignment = ag.assignments[i];

    if(typeof assignment.points_possible !== "number"){
        throw new Error ("Points possible must be a number.");
    } else if (assignment.points_possible <= 0){
        throw new Error ("Points possible must be greater than zero.");
    }

    const dueDate = new Date (assignment.due_at);

    if(dueDate > currentDate){
        continue;
    }

    validAssignments.push(assignment);

  }

  for(const submission of submissions){
    let matchingAssignment = null;

    for (let i = 0; i < validAssignments.length; i++){
        if (validAssignments[i].id === submission.assignment_id){
            matchingAssignment = validAssignments[i];
            break;
        }
    }

    if (matchingAssignment === null) {
        continue;
    }

    let learner = null;

    for (let i = 0; i < result.length; i++){
        if (result[i].id === submission.learner_id){
            learner = result[i];
            break;
        }
    }

    if (learner === null) {
        learner = {
            id: submission.learner_id,
            avg: 0,
            totalEarned: 0,
            totalPossible: 0,

        };
        result.push(learner);
    }

    // calc for getting students score
    const convertedScore = Number(submission.submission.score);

    if (Number.isNaN(convertedScore)) {
        throw new Error("Submission Score must be a valid number.");
    }

    let score = convertedScore;

    const submittedDate = new Date(
        submission.submission.submitted_at
    );

    // if(submittedDate > new Date(matchingAssignment.due_at)){
    //     score -= matchingAssignment.points_possible * 0.1;
    // }
    // replacing for a boolean statement 

    const dueDate = new Date(matchingAssignment.due_at);
    const isLate = submittedDate > dueDate;

    let latePenalty = 0;

    if(isLate){
        latePenalty = matchingAssignment.points_possible * 0.1;
    } else {
        latePenalty = 0;
    }

    score -= latePenalty;

    learner[matchingAssignment.id] = 
        score / matchingAssignment.points_possible;

    learner.totalEarned += score;
    learner.totalPossible += matchingAssignment.points_possible;
        
    }

    for (const learner of result){
        learner.avg = learner.totalEarned / learner.totalPossible;

        delete learner.totalEarned;
        delete learner.totalPossible;
    }


  return result;
}


try {
    const result = getLearnerData(
        CourseInfo,
        AssignmentGroup, 
        LearnerSubmissions,
    );
    console.log(result);
} catch (error) {
    console.log("Error:", error.message);
}