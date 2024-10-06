export interface Plan {
    type: string;
    name: string;
}

export interface Guide {
    name: string;
    path: string;
  }

export interface ExamDetails {
    dayname: string;
    [time: string]: string[] | string; // time slots with course arrays or dayname
}
  
export interface ExamContents {
    [date: string]: ExamDetails;
} 

export interface Exam {
    type: string;
    name: string;
    file: string;
  }
  

export interface Course {
    course: string;
    times: string[];
    conflict: boolean;
  }
  
export interface ExamContentsWithTimes {
    [key: string]: string[];
  }

export interface LoadingPageProps {
    message?: string;
}

export interface GpaCourse {
    name: string;
    creditHours: number;
    score: number;
  }

export interface MaterialData {
    [type: string]: {
      [item: string]: {
        [key: string]: string;
      };
    };
  }