

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


export interface ApiResponse<T>{
  success: string,
  message: string,
  data: { 
    data: T[],
    meta: PaginationMeta
  }
}
export interface PaginationMeta {
  totalNumberOfItems: number;
  totalNumberOfPages: number;
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  count?: number
}

export interface FetchEmployeeQuery{
  withUser?: boolean,
  withDepartment?:boolean
  withCount?: boolean
}
export interface FetchProjectQuery{
  withEmployees?:boolean
}
export interface FetchDepartmentQuery{
  withEmployees?: boolean,
}

export interface AllocationQueryParam { userId? : string }