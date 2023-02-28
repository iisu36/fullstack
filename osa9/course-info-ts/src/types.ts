export interface HeaderProps {
  courseName: string;
}

export interface ContentProps {
  courseParts: CoursePart[];
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescripted extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescripted {
  kind: 'basic';
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: 'group';
}

interface CoursePartBackround extends CoursePartDescripted {
  backroundMaterial: string;
  kind: 'background';
}

interface CoursePartSpecial extends CoursePartDescripted {
  kind: 'special';
  requirements: string[];
}

export type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackround
  | CoursePartSpecial;
