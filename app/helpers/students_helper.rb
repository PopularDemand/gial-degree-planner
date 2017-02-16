module StudentsHelper
  def friendly_date(meeting)
    if meeting.term == "Any"
      meeting.year.to_s
    else
      meeting.term.titleize + ' ' + meeting.year.to_s
    end
  end
end
