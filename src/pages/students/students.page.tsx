import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type {
  ClassLevelAttributes,
  StudentAttributes,
} from "../../models/interfaces";
import ServiceSelector from "../../core/ServiceSelector";

function StudentsPage() {
  useAuth();

  const [classLevels, setClassLevels] = useState<ClassLevelAttributes[]>();
  const [classLevelId, setClassLevelId] = useState(0);
  const [studentQuery, setStudentQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>();
  const [students, setStudents] = useState<StudentAttributes[]>();
  const [totalItems, setTotalItems] = useState(0);
  const debouncedStudentQuery = useDebouncedValue(studentQuery, 300);

  const totalPages = pageSize
    ? Math.max(1, Math.ceil(totalItems / pageSize))
    : undefined;

  useEffect(() => {
    ServiceSelector.absenceService
      .getAllClassLevels()
      .then(setClassLevels)
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    ServiceSelector.studentService
      .getAllPaginated(
        page,
        classLevelId || undefined,
        debouncedStudentQuery || undefined,
      )
      .then((result) => {
        setStudents(result.members);
        setTotalItems(result.totalItems);
        setPageSize((prev) => prev ?? (result.members.length || undefined));
      })
      .catch((err) => console.error(err));
  }, [page, classLevelId, debouncedStudentQuery]);

  function getClassLevelName(classLevelId?: number) {
    return classLevels?.find((el) => el.id === classLevelId)?.name ?? "—";
  }

  return (
    <div className="container mx-auto my-5">
      <h2 className="text-xl font-semibold text-slate-800">
        Liste des élèves
      </h2>
      <p className="text-slate-500 mt-1 mb-6">
        Recherchez un élève par classe ou par nom.
      </p>

      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="form-group">
          <label className="col-form-label">Classe :</label>
          <select
            className="form-control"
            value={classLevelId}
            onChange={(e) => {
              setClassLevelId(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={0}>Toutes les classes</option>
            {classLevels?.map((classLevel) => (
              <option key={classLevel.id} value={classLevel.id}>
                {classLevel.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group flex-1 min-w-[200px]">
          <label className="col-form-label">Élève :</label>
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom ou prénom"
            value={studentQuery}
            onChange={(e) => {
              setStudentQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {!students && <p className="text-slate-500">Chargement des élèves...</p>}

      {students && students.length === 0 && (
        <p className="text-slate-500">Aucun élève trouvé.</p>
      )}

      {students && students.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Élève</th>
                  <th>Classe</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-medium text-slate-800">
                      {student.name} {student.surname}
                    </td>
                    <td className="text-sm text-slate-600">
                      {getClassLevelName(student.classLevelId)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {page}
              {totalPages ? ` / ${totalPages}` : ""} · {totalItems} élève
              {totalItems > 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Précédent
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setPage((p) => p + 1)}
                disabled={totalPages != null && page >= totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentsPage;
