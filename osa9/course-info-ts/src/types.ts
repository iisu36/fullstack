export interface HeaderProps {
  courseName: string;
}

export interface ContentProps {
  courseParts: Course[];
}

export type Course = {
  name: string;
  exerciseCount: number;
};
