export const enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE"
}


export const enum WorkType {
  HYBRID = "HYBRID",
  ONSITE = "ONSITE",
  REMOTE = "REMOTE"
}


export interface NavItem{
    title: string;
    icon?: React.ReactElement<{ className : string }>;
    href: string;
    separator?: boolean;
}