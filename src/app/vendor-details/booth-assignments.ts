import { BoothAssignment } from '../models/vendor-details/booth-assignment.model';

export class BoothAssignments {
  boothAssignment1: BoothAssignment;
  boothAssignment2: BoothAssignment;
  boothAssignment3: BoothAssignment;
  boothAssignment4: BoothAssignment;

  constructor() {
    this.initializeBoothAssignments();
  }

  private initializeBoothAssignments() {
    this.boothAssignment1 = { boothNumber: '', electricity: null, locationName: '' };
    this.boothAssignment2 = { boothNumber: '', electricity: null, locationName: '' };
    this.boothAssignment3 = { boothNumber: '', electricity: null, locationName: '' };
    this.boothAssignment4 = { boothNumber: '', electricity: null, locationName: '' };
  }

  updateBoothAssignment(assignmentNumber: number, boothNumber: string, electricity: boolean, locationName: string) {
    const newBoothAssignmentObject: BoothAssignment = {
      boothNumber,
      electricity,
      locationName,
    };

    switch (assignmentNumber) {
      case 1:
        this.boothAssignment1 = newBoothAssignmentObject;
        break;
      case 2:
        this.boothAssignment2 = newBoothAssignmentObject;
        break;
      case 3:
        this.boothAssignment3 = newBoothAssignmentObject;
        break;
      case 4:
        this.boothAssignment4 = newBoothAssignmentObject;
        break;
      default:
        break;
    }
  }

  clearBoothAssignments() {
    this.initializeBoothAssignments();
  }
}
