class PlansController < ApplicationController


  def show
    @plan = Student.includes(plan: [:intended_courses, :completed_courses, { required_courses: [:term, :sessions]}, :scheduled_classes, { concentration: [ { categories: { courses: [:term, :sessions]}}, :thesis_track, :non_thesis_track]}, :electives]).find(params[:student_id]).plan
  end

  def update
    @plan = Plan.find(params[:plan][:id])
    completed_course = Course.find_by_id(params[:completed_id])
    intended_course = Course.find_by_id(params[:intended_id])
    @plan.add_or_remove_courses(completed: completed_course, intended: intended_course)
    if @plan.update_attributes(plan_params)
      render :show, status: 200
    end
  end

  def enroll_in_meeting
    @course = Course.find(params[:course_id])
    @year = Year.find(params[:meeting_year])
    @term = Term.find(params[:meeting_term])
    @meeting = Meeting.find_meeting(@course, @year, @term)
    @plan = Plan.find(params[:plan][:id])
    if @meeting
      if @plan.scheduled_classes.find_by(course_id: @meeting.course_id)
        thesis_ids = [233, 234]
        @plan.scheduled_classes.find_by(course_id: @meeting.course_id).enrollments.where(plan_id: @plan.id).delete_all
      end
      @plan.scheduled_classes << @meeting
      render :show
    else
      render :show
    end
  end

  def disenroll_from_meeting
    @course = Course.find(params[:course_id])
    @year = Year.find(params[:meeting_year])
    @term = Term.find(params[:meeting_term])
    @meeting = Meeting.find_meeting(@course, @year, @term)
    @plan = Plan.find(params[:plan][:id])
    @plan.scheduled_classes.delete(@meeting)
    render :show
  end

  private

    def plan_params
      params.require(:plan).permit(:graduation_term, :graduation_year, :concentration_id, :latest_registered, :registration_date)
    end

end
