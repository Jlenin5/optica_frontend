import { AppModal } from "@/components/ui/modal";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSale } from "../hooks/useSale";
import { useCreateSale } from "../hooks/useCreateSale";
import { useUpdateSale } from "../hooks/useUpdateSale";
import { usePatients } from "@/modules/clinical/patients/hooks/usePatients";
import { useAppointment } from "@/modules/clinical/appointments/hooks/useAppointment";
import { validateSaleOrigin } from "@/modules/clinical/appointments/utils/appointmentSale.rules";
import { usePaymentMethods } from "@/modules/finance/payments/payment_methods/hooks/usePaymentMethods";
import { usePaymentTypes } from "@/modules/finance/payments/payment_types/hooks/usePaymentTypes";
import { useCurrencies } from "@/modules/finance/accounting/currencies/hooks/useCurrencies";
import { useAuthStore } from "@/app/store/auth.store";
import { CashRegisterSkeleton } from "@/modules/finance/cash/cash_registers/components/CashRegisterSkeleton";
import MuiSvgIcon from "@components/MuiSvgIcon";
import type {
  CreateSaleDetailDTO,
  DraftSaleDetail,
  Product,
} from "../types/sales.types";
import type { Service } from "@/modules/commercial/services/types/services.types";
import "@styles/sales-form.scss";
import ModalSelectProduct from "./tabs/ModalSelectProduct";
import ModalSelectService from "./tabs/ModalSelectService";
import LensSelectionModal, {
  type LensSaleDraft,
} from "./tabs/LensSelectionModal";
import { useCreateLaboratoryOrder } from "@/modules/laboratory/laboratory_orders/hooks";
import { getStatuses } from "@/modules/statuses/api/statuses.api";
import ModalCustomItem from "./tabs/ModalCustomItem";
import { useReceipts } from "@/modules/documents/receipts/hooks/useReceipts";
import { useDaysOfCredit } from "@/modules/finance/accounting/days_of_credit/hooks/useDaysOfCredit";
import { PatientForm } from "@/modules/clinical/patients/components/PatientForm";
import { useCreatePatient } from "@/modules/clinical/patients/hooks/useCreatePatient";
import { useProducts } from "@/modules/inventory/products/hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";

interface SaleFormProps {
  isEditing?: boolean;
}

export const SaleForm: React.FC<SaleFormProps> = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentCompanyId, isSuperAdmin } = useAuthStore();
  const appointmentIdFromUrl = Number(searchParams.get("appointment_id") || 0) || null;
  const { data: sourceAppointment, isLoading: sourceAppointmentLoading } = useAppointment(appointmentIdFromUrl || 0);

  // Estados del formulario
  const [appointmentId, setAppointmentId] = useState<number | null>(appointmentIdFromUrl);
  const [patientId, setPatientId] = useState<number | null>(
    isEditing
      ? null
      : (() => {
          const fromUrl = searchParams.get("patient_id");
          return fromUrl ? Number(fromUrl) : null;
        })(),
  );
  const [paymentMethodId, setPaymentMethodId] = useState<number | undefined>(
    undefined,
  );
  const [paymentTypeId, setPaymentTypeId] = useState<number | undefined>(
    undefined,
  );
  const [daysOfCreditId, setDaysOfCreditId] = useState<number | undefined>(
    undefined,
  );
  const [currencyId, setCurrencyId] = useState<number | undefined>(undefined);
  const [receiptId, setReceiptId] = useState<number | undefined>(undefined);
  // Texto independiente del ID para permitir escribir/buscar libremente en el autocomplete.
  const [receiptSearch, setReceiptSearch] = useState("");
  const [paymentMethodSearch, setPaymentMethodSearch] = useState("");
  const [paymentTypeSearch, setPaymentTypeSearch] = useState("");

  // Estado para el modal de clientes
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const { mutate: createPatient } = useCreatePatient();

  const [exchangeRate, setExchangeRate] = useState<string>("1.00");
  const [discount, setDiscount] = useState<string>("0");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [totalPaid, setTotalPaid] = useState<string>("0");
  const [notes, setNotes] = useState<string>("");

  // Estado de productos: cada línea puede ser un ítem de catálogo (con
  // product_id) o un ítem personalizado (item_type: 'custom', sin catálogo).
  const [productsDetail, setProductsDetail] = useState<DraftSaleDetail[]>([]);
  // Controla qué modal de catálogo está abierto y con qué tipo de producto
  // filtra (Producto / Lunas / Servicios comparten el mismo componente).
  const [catalogModalType, setCatalogModalType] = useState<"product" | null>(
    null,
  );
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [lensModalOpen, setLensModalOpen] = useState(false);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [lensDrafts, setLensDrafts] = useState<LensSaleDraft[]>([]);
  const createLaboratoryOrder = useCreateLaboratoryOrder();

  // POS product search
  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebounce(productSearch, 300);

  // Estado de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Hooks de datos
  const { data: saleData, isLoading: saleLoading } = useSale(
    isEditing ? Number(id) : 0,
  );
  const { mutate: createSale, isPending: isCreating } = useCreateSale();
  const { mutate: updateSale, isPending: isUpdating } = useUpdateSale();
  const { data: patientsData, refetch: refetchPatients } = usePatients({
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined,
  });
  const { data: paymentMethodsData } = usePaymentMethods();
  const { data: paymentTypesData } = usePaymentTypes();
  const { data: daysOfCreditsData } = useDaysOfCredit();
  const { data: currenciesData } = useCurrencies();
  const { data: receiptsData } = useReceipts({ requires_sunat: true });
  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: debouncedProductSearch || undefined,
    status: true,
    limit: 60,
    company_id: !isSuperAdmin ? currentCompanyId || undefined : undefined,
  });
  const catalogProducts = productsData?.pages.flatMap((p) => p.results) || [];

  const filteredPatients = useMemo(() => {
    const patients = patientsData?.pages.flatMap((page) => page.results) || [];
    const query = patientSearch.trim().toLowerCase();
    if (!query) return patients;
    return patients.filter((patient) =>
      `${patient.first_name} ${patient.last_name} ${patient.document_number ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [patientsData, patientSearch]);
  const paymentMethods = paymentMethodsData?.pages.flatMap((page) => page.results) || [];
  const paymentTypes = paymentTypesData?.pages.flatMap((page) => page.results) || [];
  const daysOfCredits = daysOfCreditsData?.pages.flatMap((page) => page.results) || [];
  const currencies = useMemo(
    () => currenciesData?.pages.flatMap((page) => page.results) || [],
    [currenciesData],
  );
  const receipts = receiptsData?.pages.flatMap((page) => page.results) || [];

  const [isLocalCurrency, setIsLocalCurrency] = useState<boolean>(false);

  useEffect(() => {
    if (!isEditing || !saleData) return;

    setPatientId(saleData.patient_id);
    setSelectedPatientName(
      saleData.patient
        ? `${saleData.patient.first_name} ${saleData.patient.last_name} - ${saleData.patient.document_number}`
        : "",
    );
    setReceiptId(saleData.receipt_id || undefined);
    setReceiptSearch(
      saleData.receipt_id
        ? receipts.find((receipt) => receipt?.id === saleData.receipt_id)?.description || ""
        : "",
    );
    setPaymentMethodId(saleData.payment_method_id || undefined);
    setPaymentMethodSearch(
      saleData.payment_method_id
        ? paymentMethods.find((method) => method?.id === saleData.payment_method_id)?.description || ""
        : "",
    );
    setPaymentTypeId(saleData.payment_type_id || undefined);
    setPaymentTypeSearch(
      saleData.payment_type_id
        ? paymentTypes.find((type) => type?.id === saleData.payment_type_id)?.description || ""
        : "",
    );
    setDaysOfCreditId(saleData.day_of_credit_id || undefined);
    setCurrencyId(saleData.currency_id);
    setExchangeRate(saleData.exchange_rate || "1.00");
    setDiscount(saleData.discount || "0");
    setTotalPaid(saleData.total_paid || "0");
    setProductsDetail(
      (saleData.details ?? []).map((detail) => ({
        item_type: detail.item_type,
        product_id: detail.product_id,
        service_id: detail.service_id,
        lens_type_id: detail.lens_type_id,
        prescription_id: detail.prescription_id,
        laboratory_id: detail.laboratory_id,
        eyes: detail.eyes,
        custom_name: detail.custom_name,
        custom_description: detail.custom_description,
        quantity: Number(detail.quantity) || 1,
        price: Number(detail.price) || 0,
        discount_method: detail.discount_method,
        discount: Number(detail.discount) || 0,
        subtotal: Number(detail.subtotal) || 0,
        total: Number(detail.total) || 0,
        _product: detail.product,
      })),
    );
  }, [isEditing, saleData, receipts, paymentMethods, paymentTypes]);

  // Una venta originada desde una cita solo puede iniciarse cuando la cita
  // está completada. La cita también fija al paciente para evitar vender a
  // una persona distinta de la atendida.
  useEffect(() => {
    if (!appointmentIdFromUrl || isEditing || !sourceAppointment) return;
    if (sourceAppointment.status.toLowerCase() === "completed") {
      setAppointmentId(sourceAppointment.id);
      setPatientId(sourceAppointment.patient_id);
      setSelectedPatientName(
        sourceAppointment.patient
          ? `${sourceAppointment.patient.first_name} ${sourceAppointment.patient.last_name} - ${sourceAppointment.patient.document_number}`
          : `Paciente #${sourceAppointment.patient_id}`,
      );
      return;
    }
    setErrors((prev) => ({
      ...prev,
      appointment_id: "La venta desde una cita solo está disponible cuando la cita está completada.",
    }));
  }, [appointmentIdFromUrl, isEditing, sourceAppointment]);

  useEffect(() => {
    if (currencies.length > 0 && !currencyId && !isEditing) {
      const localCurrency = currencies.find((c) => c?.is_local === true);
      if (localCurrency) {
        setCurrencyId(localCurrency.id);
      } else {
        // Si no hay local, seleccionar la primera
        setCurrencyId(currencies[0]?.id);
      }
    }
  }, [currencies, currencyId, isEditing]);

  useEffect(() => {
    if (currencyId) {
      const selected = currencies.find((c) => c.id === currencyId);
      setIsLocalCurrency(selected?.is_local === true);
      // Opcional: Si es local, forzar exchangeRate a 1.00
      if (selected?.is_local) {
        setExchangeRate("1.00");
      }
    } else {
      setIsLocalCurrency(false);
    }
  }, [currencyId, currencies]);

  // Calcular totales
  const calculateTotals = useCallback(() => {
    const subtotal = Number(productsDetail.reduce(
      (sum, product) => sum + product.subtotal,
      0,
    ));
    const discountValue =
      discountType === "percentage"
        ? subtotal * (parseFloat(discount) / 100)
        : parseFloat(discount);
    const total = (subtotal - discountValue);
    const changeAmount = parseFloat(totalPaid) - total;

    return {
      subtotal,
      discountValue,
      total,
      changeAmount: changeAmount > 0 ? changeAmount : 0,
    };
  }, [productsDetail, discount, discountType, totalPaid]);

  const totals = calculateTotals();

  // Validar formulario
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!patientId) {
      newErrors.patient_id = "Seleccione un cliente";
    }

    if (appointmentId && sourceAppointment) {
      const originError = validateSaleOrigin(sourceAppointment, patientId);
      if (originError) newErrors.appointment_id = originError;
    }

    if (!paymentMethodId) {
      newErrors.payment_method_id = "Seleccione un método de pago";
    }

    if (!currencyId) {
      newErrors.currency_id = "Seleccione una moneda";
    }

    if (parseFloat(exchangeRate) <= 0) {
      newErrors.exchange_rate = "El tipo de cambio debe ser mayor a 0";
    }

    if (productsDetail.length === 0) {
      newErrors.products = "Agregue al menos un producto";
    }

    if (parseFloat(totalPaid) < totals.total) {
      newErrors.total_paid = `El monto pagado (${totalPaid}) es menor al total (${totals.total.toFixed(2)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [
    patientId,
    appointmentId,
    sourceAppointment,
    paymentMethodId,
    currencyId,
    exchangeRate,
    productsDetail,
    totalPaid,
    totals.total,
  ]);

  // Manejar blur de campos
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

  // Agregar producto
  // Agregar ítem de catálogo (Producto / Luna / Servicio)
  const handleAddCatalogItem = (
    item: CreateSaleDetailDTO,
    product: Product,
  ) => {
    setProductsDetail((prev) => [...prev, { ...item, _product: product }]);
    setCatalogModalType(null);
  };

  // Quick-add from POS grid (qty 1, no discount)
  const handleQuickAddProduct = (product: Product) => {
    const price = product.price || 0;
    const existingIdx = productsDetail.findIndex(
      (d) => d.product_id === product.id && d.item_type === "catalog",
    );
    if (existingIdx >= 0) {
      handleUpdateProduct(existingIdx, "quantity", String((productsDetail[existingIdx].quantity || 1) + 1));
      return;
    }
    handleAddCatalogItem(
      {
        item_type: "catalog",
        product_id: product.id,
        quantity: 1,
        price,
        discount_method: true,
        discount: 0,
        subtotal: price,
        total: price,
      },
      product,
    );
  };

  // Agregar ítem personalizado (p. ej. lente hecho a medida, sin catálogo)
  const handleAddLens = (draft: LensSaleDraft) => {
    setLensDrafts((prev) => [...prev, draft]);
    setProductsDetail((prev) => [
      ...prev,
      {
        ...draft.detail,
        _product: undefined,
        _lens_type_name: draft.lens_type_name,
        _laboratory_name: draft.laboratory_name,
      },
    ]);
  };

  const handleAddService = (item: CreateSaleDetailDTO, service: Service) => {
    setProductsDetail((prev) => [
      ...prev,
      {
        ...item,
        _product: undefined,
        _service: { id: service.id, name: service.name, code: service.code },
      },
    ]);
    setServiceModalOpen(false);
  };

  const handleAddCustomItem = (item: CreateSaleDetailDTO) => {
    setProductsDetail((prev) => [...prev, item]);
    setShowCustomItemModal(false);
  };

  // Eliminar producto
  const handleRemoveProduct = (index: number) => {
    setProductsDetail((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  // Actualizar producto (acepta tanto campos numéricos como de texto, ya que
  // los ítems personalizados también editan custom_name/custom_description)
  const handleUpdateProduct = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    setProductsDetail((prev) =>
      prev.map((current, itemIndex) => {
        if (itemIndex !== index) return current;

        const product = { ...current };
        const numericValue =
          typeof value === "string" ? parseFloat(value) || 0 : 0;

        if (field === "quantity") product.quantity = Math.max(1, numericValue);
        else if (field === "price") product.price = Math.max(0, numericValue);
        else if (field === "discount")
          product.discount = Math.max(0, numericValue);
        else if (field === "discount_method") {
          product.discount_method =
            typeof value === "boolean" ? value : value === "true";
        } else if (field === "custom_name")
          product.custom_name = value as string;
        else if (field === "custom_description")
          product.custom_description = value as string;
        else return product;

        if (
          ["quantity", "price", "discount", "discount_method"].includes(field)
        ) {
          product.subtotal = product.quantity * product.price;
          const discount = product.discount || 0;
          product.total = product.discount_method
            ? Math.max(0, product.subtotal * (1 - discount / 100))
            : Math.max(0, product.subtotal - discount);
        }

        return product;
      }),
    );
  };

  // Enviar formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      // Marca todos los campos como "tocados" para que los mensajes de error
      // (incluido el de productos) se muestren tras un intento de envío,
      // no solo cuando el usuario pasa el foco por cada campo.
      setTouched({
        patient_id: true,
        receipt_id: true,
        payment_method_id: true,
        currency_id: true,
        exchange_rate: true,
        products: true,
        total_paid: true,
      });
      return;
    }

    const formData = {
      company_id: currentCompanyId! || null,
      patient_id: patientId!,
      appointment_id: appointmentId,
      payment_method_id: paymentMethodId || null,
      payment_type_id: paymentTypeId || null,
      currency_id: currencyId!,
      receipt_id: receiptId!,
      exchange_rate: parseFloat(exchangeRate),
      discount: discount !== "0" ? parseFloat(discount) : 0,
      subtotal: totals.subtotal,
      total: totals.total,
      total_paid: parseFloat(totalPaid),
      change_amount: totals.changeAmount,
      sale_status_id: null,
      // _product es solo un dato de conveniencia para la UI (mostrar nombre
      // y tipo en la tabla); el backend solo espera los campos del DTO.
      details: productsDetail.map(
        ({
          _product,
          _service,
          _lens_type_name,
          _laboratory_name,
          ...detail
        }) => detail,
      ),
    };

    if (isEditing && id) {
      updateSale({ id: Number(id), data: formData }, {
        onSuccess: () => {
          navigate('/sales')
        }
      })
    } else {
    createSale(formData, {
      onSuccess: async (sale) => {
        if (lensDrafts.length) {
          const statuses = await getStatuses({
            search: "LAB_PENDING",
            limit: 10,
          });
          const pendingStatus =
            statuses.results.find(
              (status: any) => status.code === "LAB_PENDING",
            ) || statuses.results[0];
          if (!pendingStatus)
            throw new Error(
              "No existe un estado PENDIENTE para órdenes de laboratorio",
            );
          for (const draft of lensDrafts) {
            await createLaboratoryOrder.mutateAsync({
              sale_id: sale.id,
              patient_id: patientId!,
              laboratory_id: draft.laboratory_id,
              prescription_id: draft.prescription_id,
              order_status_id: pendingStatus.id,
              details: draft.eyes.map((eye) => ({
                lens_type_id: draft.lens_type_id,
                eye,
                quantity: 1,
                unit_price: draft.detail.price,
                sale_detail_id: null,
              })),
            });
          }
        }
        navigate("/sales");
      },
    });
    }
  };

  if (saleLoading || (appointmentIdFromUrl && sourceAppointmentLoading)) {
    return <CashRegisterSkeleton />;
  }

  return (
    <div className="sale-form-page">
      <div className="sale-form-page__header">
        <button
          className="sale-form-page__back-btn"
          onClick={() => navigate("/sales")}
          type="button"
        >
          <MuiSvgIcon size={20}>lucide:arrow-left</MuiSvgIcon>
        </button>
        <h1 className="sale-form-page__title">
          {isEditing ? "Editar Venta" : "Nueva Venta"}
        </h1>
      </div>

      <form className="sale-pos" onSubmit={handleSubmit}>
        {/* LEFT: Product catalog */}
        <div className="sale-pos__catalog">
          <div className="sale-pos__search-bar">
            <div className="sale-pos__search-bar__input-wrap">
              <MuiSvgIcon size={18}>lucide:search</MuiSvgIcon>
              <input
                type="text"
                placeholder="Buscar productos... [F5]"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="sale-pos__search-bar__actions">
              <button
                type="button"
                className="sale-pos__search-bar__action-btn"
                onClick={() => setCatalogModalType("product")}
                title="Agregar producto avanzado"
              >
                <MuiSvgIcon size={16}>lucide:plus</MuiSvgIcon>
                Producto
              </button>
              <button
                type="button"
                className="sale-pos__search-bar__action-btn"
                onClick={() => {
                  if (!patientId) {
                    setErrors((prev) => ({
                      ...prev,
                      patient_id: "Seleccione un cliente antes de agregar lunas",
                    }));
                    setShowPatientModal(true);
                    return;
                  }
                  setLensModalOpen(true);
                }}
              >
                <MuiSvgIcon size={16}>lucide:glasses</MuiSvgIcon>
                Lunas
              </button>
              <button
                type="button"
                className="sale-pos__search-bar__action-btn"
                onClick={() => setServiceModalOpen(true)}
              >
                <MuiSvgIcon size={16}>lucide:wrench</MuiSvgIcon>
                Servicios
              </button>
              <button
                type="button"
                className="sale-pos__search-bar__action-btn"
                onClick={() => setShowCustomItemModal(true)}
              >
                <MuiSvgIcon size={16}>lucide:sparkles</MuiSvgIcon>
                Custom
              </button>
            </div>
          </div>

          <div className="sale-pos__grid-wrap">
            {productsLoading ? (
              <div className="sale-pos__empty">
                <MuiSvgIcon size={40}>lucide:loader-2</MuiSvgIcon>
                <p>Cargando productos...</p>
              </div>
            ) : catalogProducts.length === 0 ? (
              <div className="sale-pos__empty">
                <MuiSvgIcon size={48}>lucide:package-open</MuiSvgIcon>
                <p>No se encontraron productos</p>
              </div>
            ) : (
              <div className="sale-pos__grid">
                {catalogProducts.map((product) => (
                  <div
                    key={product.id}
                    className="sale-pos__product-card"
                    onClick={() => handleQuickAddProduct(product)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleQuickAddProduct(product);
                      }
                    }}
                  >
                    <div className="sale-pos__product-card__img">
                      {product.featured_image ? (
                        <img
                          src={product.featured_image}
                          alt={product.name}
                          loading="lazy"
                        />
                      ) : (
                        <span className="sale-pos__product-card__img--placeholder">
                          <MuiSvgIcon size={36}>lucide:glasses</MuiSvgIcon>
                        </span>
                      )}
                    </div>
                    <div className="sale-pos__product-card__body">
                      <div className="sale-pos__product-card__name">
                        {product.name}
                      </div>
                      <div className="sale-pos__product-card__price">
                        S/ {Number(product.price || 0).toFixed(2)}
                      </div>
                      {product.total_stock != null && (
                        <div className="sale-pos__product-card__stock">
                          Stock: {product.total_stock}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cart */}
        <div className="sale-pos__cart">
          <div className="sale-pos__cart-header">
            <h2>Carrito</h2>
            <div className="sale-pos__cart-header__actions">
              {productsDetail.length > 0 && (
                <button
                  type="button"
                  className="sale-pos__cart-header__btn sale-pos__cart-header__btn--danger"
                  onClick={() => setProductsDetail([])}
                >
                  <MuiSvgIcon size={14}>lucide:trash-2</MuiSvgIcon>
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="sale-pos__customer">
            {patientId && selectedPatientName ? (
              <div className="sale-pos__customer__selected">
                <div className="sale-pos__customer__selected-info">
                  <strong>{selectedPatientName.split(" - ")[0]}</strong>
                  <span>{selectedPatientName.split(" - ")[1] || ""}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPatientModal(true)}
                  title="Cambiar cliente"
                >
                  <MuiSvgIcon size={16}>lucide:pencil</MuiSvgIcon>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="sale-pos__customer__select-btn"
                onClick={() => setShowPatientModal(true)}
              >
                <MuiSvgIcon size={18}>lucide:user-plus</MuiSvgIcon>
                Seleccionar cliente
              </button>
            )}
            {touched.patient_id && errors.patient_id && (
              <span className="sale-form__error" style={{ display: "block", marginTop: 6 }}>
                {errors.patient_id}
              </span>
            )}
          </div>

          {/* Items */}
          <div className="sale-pos__items">
            {productsDetail.length === 0 ? (
              <div className="sale-pos__empty-cart">
                <MuiSvgIcon size={36}>lucide:shopping-cart</MuiSvgIcon>
                <p>Agrega productos desde el catálogo</p>
              </div>
            ) : (
              productsDetail.map((item, index) => {
                const name =
                  item.item_type === "custom"
                    ? item.custom_name || "Ítem personalizado"
                    : item.lens_type_id
                      ? item._lens_type_name || `Luna #${item.lens_type_id}`
                      : item.service_id
                        ? item._service?.name || `Servicio #${item.service_id}`
                        : item._product?.name || "Producto";
                return (
                  <div key={index} className="sale-pos__item">
                    <span className="sale-pos__item__num">{index + 1}</span>
                    <div className="sale-pos__item__info">
                      <div className="sale-pos__item__info-name">{name}</div>
                      <div className="sale-pos__item__info-meta">
                        S/ {Number(item.price || 0).toFixed(2)} c/u
                      </div>
                    </div>
                    <div className="sale-pos__item__qty">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateProduct(
                            index,
                            "quantity",
                            String(Math.max(1, (item.quantity || 1) - 1)),
                          )
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateProduct(
                            index,
                            "quantity",
                            String((item.quantity || 1) + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="sale-pos__item__price">
                      S/ {Number(item.total || 0).toFixed(2)}
                    </div>
                    <button
                      type="button"
                      className="sale-pos__item__remove"
                      onClick={() => handleRemoveProduct(index)}
                      title="Quitar"
                    >
                      <MuiSvgIcon size={14}>lucide:x</MuiSvgIcon>
                    </button>
                  </div>
                );
              })
            )}
            {touched.products && errors.products && (
              <span className="sale-form__error" style={{ display: "block", padding: "0 16px" }}>
                {errors.products}
              </span>
            )}
          </div>

          {/* Totals */}
          <div className="sale-pos__totals">
            <div className="sale-pos__totals__row">
              <span>Subtotal</span>
              <span>S/ {totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discountValue > 0 && (
              <div className="sale-pos__totals__row">
                <span>Descuento</span>
                <span>− S/ {totals.discountValue.toFixed(2)}</span>
              </div>
            )}
            <div className="sale-pos__totals__row sale-pos__totals__row--total">
              <span>
                Total ({productsDetail.length} ítem
                {productsDetail.length !== 1 ? "s" : ""})
              </span>
              <span>S/ {totals.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="sale-pos__payment">
            <div className="sale-pos__payment__meta">
              <select
                value={paymentMethodId || ""}
                onChange={(e) =>
                  setPaymentMethodId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                onBlur={() => handleBlur("payment_method_id")}
              >
                <option value="">Método de pago</option>
                {paymentMethods.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.description}
                  </option>
                ))}
              </select>
              <select
                value={currencyId || ""}
                onChange={(e) =>
                  setCurrencyId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                onBlur={() => handleBlur("currency_id")}
              >
                <option value="">Moneda</option>
                {currencies?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code || c.name}
                  </option>
                ))}
              </select>
              <select
                value={receiptId || ""}
                onChange={(e) =>
                  setReceiptId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                onBlur={() => handleBlur("receipt_id")}
              >
                <option value="">Comprobante</option>
                {receipts.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.description}
                  </option>
                ))}
              </select>
            </div>

            {(errors.payment_method_id || errors.currency_id || errors.receipt_id) && (
              <span className="sale-form__error">
                Complete método de pago, moneda y comprobante
              </span>
            )}

            <div className="sale-pos__payment__methods">
              <button
                type="submit"
                className="sale-pos__payment__btn sale-pos__payment__btn--primary"
                disabled={isCreating || isUpdating || productsDetail.length === 0}
              >
                {isCreating || isUpdating ? (
                  <>
                    <MuiSvgIcon size={16}>lucide:loader-2</MuiSvgIcon>
                    Guardando...
                  </>
                ) : (
                  <>
                    <MuiSvgIcon size={16}>lucide:check</MuiSvgIcon>
                    Cobrar / Guardar
                  </>
                )}
              </button>
              <button
                type="button"
                className="sale-pos__payment__btn"
                onClick={() => navigate("/sales")}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Modal de selección de productos de catálogo (Producto / Lunas / Servicios) */}
      {lensModalOpen && (
        <LensSelectionModal
          patientId={patientId}
          onClose={() => setLensModalOpen(false)}
          onAdd={(draft) => {
            handleAddLens(draft);
            setLensModalOpen(false);
          }}
        />
      )}

      {catalogModalType && (
        <ModalSelectProduct
          productType={catalogModalType}
          title="Agregar Producto"
          searchPlaceholder="Buscar producto..."
          emptyLabel="No se encontraron productos"
          onClose={() => setCatalogModalType(null)}
          onAdd={handleAddCatalogItem}
        />
      )}

      {serviceModalOpen && (
        <ModalSelectService
          onClose={() => setServiceModalOpen(false)}
          onAdd={handleAddService}
        />
      )}

      {/* Modal de ítem personalizado (p. ej. lente hecho a medida) */}
      {showCustomItemModal && (
        <ModalCustomItem
          onClose={() => setShowCustomItemModal(false)}
          onAdd={handleAddCustomItem}
        />
      )}

      {showPatientModal && (
        <AppModal
          title="Seleccionar Cliente"
          onClose={() => setShowPatientModal(false)}
          size="lg"
        >
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nombre, documento..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="btn-new-patient"
            >
              <MuiSvgIcon size={18}>lucide:user-plus</MuiSvgIcon>
              Nuevo Cliente
            </button>
          </div>
          <div className="patient-list">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="patient-item"
                onClick={() => {
                  setPatientId(patient.id);
                  setSelectedPatientName(
                    `${patient.first_name} ${patient.last_name} - ${patient.document_number}`,
                  );
                  setShowPatientModal(false);
                  setTouched({ ...touched, patient_id: true });
                }}
              >
                <span className="patient-name">
                  {patient.first_name} {patient.last_name}
                </span>
                <span className="patient-doc">{patient.document_number}</span>
              </div>
            ))}
            {filteredPatients.length === 0 && (
              <div className="empty-state">
                <p>No se encontraron clientes</p>
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(true)}
                >
                  Crear nuevo cliente
                </button>
              </div>
            )}
          </div>
        </AppModal>
      )}

      {showNewPatientModal && (
        <AppModal
          title="Nuevo Cliente"
          onClose={() => setShowNewPatientModal(false)}
          size="lg"
        >
          <PatientForm
            onSubmit={async (data) => {
              try {
                createPatient(data, {
                  onSuccess: (newPatient) => {
                    setPatientId(newPatient.id);
                    setSelectedPatientName(
                      `${newPatient.first_name} ${newPatient.last_name} - ${newPatient.document_number}`,
                    );
                    setShowNewPatientModal(false);
                    setShowPatientModal(false);
                    // Refrescar lista de clientes (si es necesario)
                    refetchPatients();
                  },
                });
              } catch (error) {
                console.log(error);
              }
            }}
          />
        </AppModal>
      )}
    </div>
  );
};