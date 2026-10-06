import { useEffect, useState } from "react";
import type { AbsenceReasonStdAttributes } from "../../models/interfaces";
import ServiceSelector from "../../core/ServiceSelector";
import { useFormik } from "formik";
import * as Yup from "yup";
import { datetimeFormatStd } from "../../utils/date.utils";
import { useNavigate, useParams } from "react-router";

function ConfirmerRetourPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const absenceId = Number(id);
  const [reasonStds, setReasonStds] = useState<AbsenceReasonStdAttributes[]>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      returnDate: datetimeFormatStd(new Date()),
      reasonStdId: 0,
      reasonDetail: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);

      try {
        await ServiceSelector.absenceService.sendAbsenceReturn(absenceId, {
          returnDate: new Date(values.returnDate),
          reasonStdId: values.reasonStdId || undefined,
          reasonDetail: values.reasonDetail,
        });
        navigate("/");
      } catch (err) {
        console.error(err);
        setSubmitError("Une erreur est survenue lors de l'enregistrement.");
      } finally {
        setSubmitting(false);
      }
    },
    validationSchema: Yup.object({
      returnDate: Yup.date().required("Ce champ est obligatoire"),
    }),
  });

  useEffect(() => {
    ServiceSelector.absenceService
      .getReasonStds()
      .then(setReasonStds)
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="mx-auto container my-5">
      <button type="button" onClick={() => navigate(-1)} className="btn mb-5">
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

      <form onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label className="col-form-label">Date de retour :</label>
          <div>
            <input
              type="datetime-local"
              className="form-control"
              name="returnDate"
              value={formik.values.returnDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <small className="text-danger">
              {formik.errors.returnDate &&
                formik.touched.returnDate &&
                formik.errors.returnDate}
            </small>
          </div>
        </div>
        <div className="form-group mt-4">
          <label className="col-form-label">Motif :</label>
          <select
            className="form-control"
            name="reasonStdId"
            value={formik.values.reasonStdId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value=""></option>
            {reasonStds?.map((el) => (
              <option key={el.id} value={el.id}>
                {el.description}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group mt-4">
          <label className="col-form-label">Motif détaillé :</label>
          <textarea
            className="form-control"
            name="reasonDetail"
            value={formik.values.reasonDetail}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          ></textarea>
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="btn"
            type="submit"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfirmerRetourPage;
