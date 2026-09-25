import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import "./create-absence.page.scss";
import type {
  ClassLevelAttributes,
  StudentAttributes,
} from "../../models/interfaces";
import ServiceSelector from "../../core/ServiceSelector";
import { useFormik } from "formik";

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function CreateAbsence() {
  const navigate = useNavigate();
  const [classLevels, setClassLevels] = useState<ClassLevelAttributes[]>();
  const [students, setStudents] = useState<StudentAttributes[]>([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<StudentAttributes | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [overrideDate, setOverrideDate] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const debouncedStudentQuery = useDebouncedValue(studentQuery, 300);

  useEffect(() => {
    if (overrideDate) return;
    const intervalId = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(intervalId);
  }, [overrideDate]);

  useAuth();
  useEffect(() => {
    ServiceSelector.absenceService.getAllClassLevels().then(setClassLevels);
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      classLevelId: classLevels?.[0].id ?? 0,
      studentId: 0,
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedStudent) return;

      const selectedClassLevel = classLevels?.find(
        (classLevel) => classLevel.id == values.classLevelId,
      );

      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const body = {
          studentId: selectedStudent.id!,
          studentName: selectedStudent.name ?? "",
          studentSurname: selectedStudent.surname ?? "",
          studentClass: selectedClassLevel?.name ?? "",
          absenceDate:
            overrideDate && values.date ? new Date(values.date) : undefined,
        };
        console.log(body);
        await ServiceSelector.absenceService.createAbsence(body);
        setSubmitSuccess(true);
        resetForm();
        setSelectedStudent(null);
        setStudentQuery("");
        setOverrideDate(false);
      } catch (err) {
        console.error(err);
        setSubmitError("Une erreur est survenue lors de l'enregistrement.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (classLevels && classLevels.length > 0 && !formik.values.classLevelId) {
      formik.setFieldValue("classLevelId", classLevels[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classLevels]);

  useEffect(() => {
    if (!formik.values.classLevelId) return;

    ServiceSelector.absenceService
      .findStudents({
        class_level: formik.values.classLevelId,
        name: debouncedStudentQuery || undefined,
      })
      .then(setStudents)
      .catch((err) => console.error(err));
  }, [formik.values.classLevelId, debouncedStudentQuery]);

  function handleOverrideDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setOverrideDate(checked);
    formik.setFieldValue("date", checked ? toDatetimeLocalValue(now) : "");
  }

  function handleClassLevelChange(e: React.ChangeEvent<HTMLSelectElement>) {
    formik.handleChange(e);
    setSelectedStudent(null);
    setStudentQuery("");
    formik.setFieldValue("studentId", 0);
  }

  function selectStudent(student: StudentAttributes) {
    setSelectedStudent(student);
    formik.setFieldValue("studentId", student.id);
    setStudentQuery(`${student.name ?? ""} ${student.surname ?? ""}`.trim());
    setStudents([]);
  }

  return (
    <div className="create-absence-page container mx-auto">
      <div className="my-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn mb-5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Retour
        </button>

        {submitError && (
          <div className="mb-5 rounded-lg border border-danger-200 bg-danger-50 px-4 py-2.5 text-sm text-danger-700">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="mb-5 rounded-lg border border-success-200 bg-success-50 px-4 py-2.5 text-sm text-success-700">
            Absence enregistrée avec succès.
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mt-3">
            <label className="col-form-label">Date et heure :</label>
            <input
              type="datetime-local"
              className="form-control"
              name="date"
              value={
                overrideDate ? formik.values.date : toDatetimeLocalValue(now)
              }
              onChange={formik.handleChange}
              disabled={!overrideDate}
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-600 select-none">
              <input
                type="checkbox"
                checked={overrideDate}
                onChange={handleOverrideDateChange}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
              Modifier la date
            </label>
          </div>
          <div className="form-group mt-3">
            <label className="col-form-label">Classe :</label>
            <select
              className="form-control"
              name="classLevelId"
              value={formik.values.classLevelId}
              onChange={handleClassLevelChange}
            >
              {classLevels?.map((classLevel) => (
                <option key={classLevel.id} value={classLevel.id}>
                  {classLevel.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mt-3">
            <label className="col-form-label">Elève :</label>
            <div className="relative">
              <input
                type="text"
                className="form-control pr-9"
                value={studentQuery}
                onChange={(e) => {
                  setSelectedStudent(null);
                  formik.setFieldValue("studentId", 0);
                  setStudentQuery(e.target.value);
                }}
              />
              {studentQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    formik.setFieldValue("studentId", 0);
                    setStudentQuery("");
                    setStudents([]);
                  }}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition hover:text-slate-600"
                  aria-label="Annuler la sélection"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {students.length > 0 && (
              <div className="mt-2 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white shadow-sm">
                {students.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => selectStudent(student)}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    {student.name} {student.surname}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="btn-primary"
              disabled={!selectedStudent || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Enregistrement..." : "Marquer l'absence"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAbsence;
